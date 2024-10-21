import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth } from '@nestjs/swagger';
import { V1_MESSAGES } from '../route.constants';
import { CreateMessageHttpDto } from './create-message.http-dto';
import { User } from 'src/auth/schemas/user.schema';
import { CreateMessageUseCase } from 'src/contexts/messages/application/create-message-use-case/create-message.use-case';
import { Message } from 'src/contexts/messages/domain/message.entity';
  @ApiBearerAuth()
  @Controller(V1_MESSAGES)
  export class CreateMessageController {
    constructor(private readonly  createMessageUseCase: CreateMessageUseCase ) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async run(
      @Body() createMessageData: CreateMessageHttpDto,
      @Req() req: Request & { user: User },
    ): Promise<Message> {
      const user = req.user; 
      return this.createMessageUseCase.execute({ ...createMessageData, senderId: user._id.toString()});
    }
  }
  