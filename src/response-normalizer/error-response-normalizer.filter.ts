import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { MessageNotFoundException } from "src/contexts/messages/domain/message-not-found.exception";
import { MessageUnauthorizedException } from "src/contexts/messages/domain/message-unauthorized.exception";

@Catch()
export class ErrorResponseNormalizerFilter implements ExceptionFilter {
  async catch(rawException: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<FastifyReply>();

    const exception = this.mapCoreError(rawException);

    const status = exception.getStatus();

    await response.status(status).send({ error: this.mapToError(exception) });
  }
  
  private mapCoreError(error){
    if(error instanceof MessageUnauthorizedException)
      return  new UnauthorizedException(error.message)
    if(error instanceof MessageNotFoundException)
      return new NotFoundException(error.message)
    if(error instanceof HttpException)
      return error;

    return  new InternalServerErrorException();

   }
  
  
  private mapToError(error: HttpException) {
    return {
      message: error.message,
      status: error.getStatus(),
      reasons: this.getReasons(error),
    };
  }

  private getReasons(error: HttpException): string[] | undefined {
    if (!(error instanceof BadRequestException)) {
      return;
    }

    const response = error.getResponse() as { message?: string[] };
    return response?.message || [];
  }
}
