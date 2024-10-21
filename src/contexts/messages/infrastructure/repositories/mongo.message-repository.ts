import {
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';
import { MessageRepository } from '../../domain/message.repository';
import { Message, MessageFilterParams, MessageStatus } from '../../domain/message.entity';
import { MessageEntity } from './message.schema';

  @Injectable()
  export class MongoMessageRepository extends MessageRepository {
    constructor(
      @InjectModel(MessageEntity.name)
      private messageModel: mongoose.Model<MessageEntity>,
    ) {
        super();
    }
  

    async sendMessage( message: Message): Promise<Message> {
      const messageCreated = await this.messageModel.create({
        content: message.content,
        sender: message.senderId,
        receiver: message.receiverId});
      return this.toMessage(messageCreated) ;
    }
 
    async findMessageById(id: string): Promise<Message> {
      const isValidId = mongoose.isValidObjectId(id);
  
      if (!isValidId) {
        throw new BadRequestException('Please enter correct id.');
      }
  
      const message = await this.messageModel
        .findById(id)
        .populate('sender receiver');
  
      if (!message) {
        throw new NotFoundException('Message not found.');
      }
  
      return this.toMessage(message);
    }
  
   
    async updateMessageStatus(id: string, status: MessageStatus
    ): Promise<Message> {
      const isValidId = mongoose.isValidObjectId(id);

      if (!isValidId) {
        throw new BadRequestException('Please enter correct id.');
      }
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException('Message not found.');
      }

      message.status = status;
      const updateMessage   = await message.save();
      return this.toMessage(updateMessage);   ;
    }
 
    async findAllMessageWithfilter(filterMessages: MessageFilterParams): Promise<Message[]> {
      const { status, isStarred } = filterMessages;
      const resPerPage = Number(filterMessages.limit) || 10;
      const currentPage = Number(filterMessages.page) || 1;
      const skip = resPerPage * (currentPage - 1);
  
      const mongoQuery = this.messageModel.find();
  
      if (status) {
        mongoQuery.where('status').equals(status);
      }
  
      if (isStarred) {
        mongoQuery.where('isStarred').equals(isStarred == true);
      }
  
      const messages = await mongoQuery
        .limit(resPerPage)
        .skip(skip)
        .populate('sender receiver')
        .exec();
  
      return messages.map((message) => this.toMessage(message));
    }
  
    async deleteMessage(id: string): Promise<{ deleted: boolean }> {
      const isValidId = mongoose.isValidObjectId(id);
  
      if (!isValidId) {
        throw new BadRequestException('Please enter correct id.');
      }
  
      const message = await this.messageModel.findById(id);
  
      if (!message) {
        throw new NotFoundException('Message not found.');
      }
  
      await this.messageModel.findByIdAndDelete(id);
      return { deleted: true };
    }

//66ae14b66cade404f10bd457
    private toMessage(message: MessageEntity & {_id: mongoose.Types.ObjectId;}
     ): Message{
        return {
            id: message._id.toString(),
            content: message.content,
            senderId: message.sender._id.toString(),
            receiverId: message?.receiver._id.toString(),
            status: message.status,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };
    }
  }
  