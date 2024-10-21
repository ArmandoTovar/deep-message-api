import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessagesDto } from './dto/filter-message.dto';

import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Message } from './schemas/message.schema';
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: mongoose.Model<Message>,
  ) {}

/**
 * Sends a message.
 *
 * @param {string} senderId - The ID of the sender.
 * @param {CreateMessageDto} createMessageDto - The DTO containing the message details.
 * @return {Promise<Message>} A promise that resolves to the created message.
 */
  async sendMessage(
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { receiver, content } = createMessageDto;
    const message = await this.messageModel.create({
      sender: senderId,
      receiver,
      content,
    });
    return message;
  }
  /**
   * Finds a message by its ID.
   *
   * @param {string} id - The ID of the message to be found.
   * @return {Promise<Message>} A promise that resolves to the found message, or throws a BadRequestException if the ID is invalid or a NotFoundException if the message is not found.
   */
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

    return message;
  }

  /**
   * Updates the status of a message.
   *
   * @param {string} id - The ID of the message.
   * @param {UpdateMessageStatusDto} updateMessageStatusDto - The DTO containing the updated status.
   * @return {Promise<Message>} - A promise that resolves to the updated message.
   */
  async updateMessageStatus(
    id: string,
    updateMessageStatusDto: UpdateMessageStatusDto,
  ): Promise<Message> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const message = await this.messageModel.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    message.status = updateMessageStatusDto.status;
    return message.save();
  }

  /**
   * Filters messages based on the provided filter criteria and pagination options.
   *
   * @param {FilterMessagesDto} filterMessagesDto - The DTO containing the filter criteria.
   * @param {any} query - The query object containing pagination options.
   * @return {Promise<Message[]>} - A promise that resolves to an array of messages that match the filter criteria.
   */
  async filterMessages(
    filterMessagesDto: FilterMessagesDto,
    query: any,
  ): Promise<Message[]> {
    const { status, isStarred } = filterMessagesDto;
    const resPerPage = Number(query.limit) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const mongoQuery = this.messageModel.find();

    if (status) {
      mongoQuery.where('status').equals(status);
    }

    if (isStarred) {
      mongoQuery.where('isStarred').equals(isStarred === 'true');
    }

    const messages = await mongoQuery
      .limit(resPerPage)
      .skip(skip)
      .populate('sender receiver')
      .exec();

    return messages;
  }

  /**
   * Deletes a message by its ID.
   *
   * @param {string} id - The ID of the message to be deleted.
   * @return {Promise<{ deleted: boolean }>} A promise that resolves to an object with a 'deleted' property set to true if the message is successfully deleted.
   */
  async deleteMessageById(id: string): Promise<{ deleted: boolean }> {
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
}
