import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Message, MessageStatus } from './schemas/message.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Throttle } from '@nestjs/throttler';
import { FilterMessagesDto } from './dto/filter-message.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MessageStatus,
    description: 'Filter messages by status',
  })
  @ApiQuery({
    name: 'isStarred',
    required: false,
    type: Boolean,
    description: 'Filter messages by starred status',
  })
  async filterMessages(
    @Query() filterMessagesDto: FilterMessagesDto,
    @Query() query: ExpressQuery,
  ): Promise<Message[]> {
    return this.messageService.filterMessages(filterMessagesDto, query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request & { user: User },
  ): Promise<Message> {
    const user = req.user; 
    return this.messageService.sendMessage(user._id as string, createMessageDto);
  }

  @Get(':id')
  async getMessage(@Param('id') id: string): Promise<Message> {
    return this.messageService.findMessageById(id);
  }

  @Patch(':id/status')
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
  ): Promise<Message> {
    return this.messageService.updateMessageStatus(id, updateMessageStatusDto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.messageService.deleteMessageById(id);
  }
}
