import {
  BadRequestException,
  Body,
    Controller,
    Delete,
    Param,
    Patch,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth } from '@nestjs/swagger';
import { V1_MESSAGES } from '../route.constants';
import { User } from 'src/auth/schemas/user.schema';
import { UpdateMessageUseCase } from 'src/contexts/messages/application/update-message-use-case/update-message.use-case';
import { UpdateMessageHttpDto } from './update-message.http-dto';
import { Message } from 'src/contexts/messages/domain/message.entity';
  @ApiBearerAuth()
  @Controller(V1_MESSAGES)
  export class UpdateMessageController {
    constructor(private readonly  updateMessageUseCase: UpdateMessageUseCase ) {}
    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'))
    async run(@Param('id') id: string, @Body() updateMessageData: UpdateMessageHttpDto,
    @Req() req: Request & { user: User },): Promise<Message> {
    
       return this.updateMessageUseCase.execute({...updateMessageData,id , receiverId: req.user._id.toString()});
    
    
    }

  }
  