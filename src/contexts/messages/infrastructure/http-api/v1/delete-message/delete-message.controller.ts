import {
    Controller,
    Delete,
    Param,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth } from '@nestjs/swagger';
import { V1_MESSAGES } from '../route.constants';
import { DeleteMessageUseCase } from 'src/contexts/messages/application/delete-message-use-case/delete-message.use-case';
import { User } from 'src/auth/schemas/user.schema';
  @ApiBearerAuth()
  @Controller(V1_MESSAGES)
  export class DeleteMessageController {
    constructor(private readonly  deleteMessageUseCase: DeleteMessageUseCase ) {}
  
    @Delete()
    @UseGuards(AuthGuard('jwt'))
    async run(@Param('id') id: string,
    @Req() req: Request & { user: User },): Promise<{ deleted: boolean }> {
      return this.deleteMessageUseCase.execute({id, senderId: req.user._id.toString()});
    }
  }
  