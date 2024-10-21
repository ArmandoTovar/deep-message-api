import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MessageService } from './message.service';
import { Message, MessageStatus } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { FilterMessagesDto } from './dto/filter-message.dto';

const mockUser = {
  _id: '66adf8f44effc4d94cf887d2',
  name: 'test',
  email: 'test@test.com',
};

const mockUser2 = {
  _id: '60d0fe4f5311236168a109cb',
  name: 'test2',
  email: 'test2@test.com',
};

const mockMessage = {
  _id: new mongoose.Types.ObjectId().toString(),
  sender: new mongoose.Types.ObjectId(),
  receiver: new mongoose.Types.ObjectId(),
  content: 'Test message',
  status: MessageStatus.UNREAD,
  isStarred: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMessageModel = {
  create: jest.fn().mockResolvedValue(mockMessage),
  findById: jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(mockMessage),
    exec: jest.fn().mockResolvedValue(mockMessage),
  }),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockMessage),
  find: jest.fn().mockReturnValue({
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockMessage]),
  }),
  save: jest.fn().mockResolvedValue(mockMessage),
};

describe('MessageService', () => {
  let service: MessageService;
  let model: Model<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    model = module.get<Model<Message>>(getModelToken(Message.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should create and return a message', async () => {
      const createMessageDto: CreateMessageDto = {
        receiver: mockUser2._id as any,
        content: 'Test message',
      };

      jest.spyOn(model, 'create').mockImplementationOnce(():any=> Promise.resolve(mockMessage));

      const result = await service.sendMessage(mockUser._id, createMessageDto);
      expect(result).toEqual(mockMessage);
      expect(model.create).toHaveBeenCalledWith({
        sender: mockUser._id,
        receiver: createMessageDto.receiver,
        content: createMessageDto.content,
      });
    });
  });

  describe('findMessageById', () => {
    it('should return a message', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMessage),
      } as any);

      const result = await service.findMessageById(mockMessage._id as any);
      expect(result).toEqual(mockMessage);
      expect(model.findById).toHaveBeenCalledWith(mockMessage._id);
    });

    it('should throw NotFoundException if message not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findMessageById(mockMessage._id as any)).rejects.toThrow('Message not found.');
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findMessageById('invalidId')).rejects.toThrow('Please enter correct id.');
    });
  });

  describe('updateMessageStatus', () => {
    it('should update and return a message', async () => {
      const updateMessageStatusDto: UpdateMessageStatusDto = { status: MessageStatus.READ };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockMessage,
         
        }),
        save: jest.fn().mockResolvedValue({
          ...mockMessage,
          status: MessageStatus.READ,
        }),
      } as any);

      const result = await service.updateMessageStatus(mockMessage._id as any, updateMessageStatusDto);
      expect(result.status).toEqual(MessageStatus.READ);
      expect(model.findById).toHaveBeenCalledWith(mockMessage._id);
    });

    it('should throw NotFoundException if message not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue(null);

      await expect(service.updateMessageStatus(mockMessage._id as any, { status: MessageStatus.READ })).rejects.toThrow('Message not found.');
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.updateMessageStatus('invalidId', { status: MessageStatus.READ })).rejects.toThrow('Please enter correct id.');
    });
  });

  describe('filterMessages', () => {
    it('should return an array of messages', async () => {
      const filterMessagesDto: FilterMessagesDto = {};
      const query = { page: '1', limit: '10' };

      jest.spyOn(model, 'find').mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMessage]),
      } as any);

      const result = await service.filterMessages(filterMessagesDto, query);
      expect(result).toEqual([mockMessage]);
    });
  });

  describe('deleteMessageById', () => {
    it('should delete a message and return the result', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMessage),
      } as any);
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMessage),
      } as any);

      const result = await service.deleteMessageById(mockMessage._id as any);
      expect(result).toEqual({ deleted: true });
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockMessage._id);
    });

    it('should throw NotFoundException if message not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue(null);
      await expect(service.deleteMessageById(mockMessage._id as any)).rejects.toThrow('Message not found.');
    });

    it('should throw BadRequestException for invalid id', async () => {
    
      await expect(service.deleteMessageById('invalidId')).rejects.toThrow('Please enter correct id.');
    });
  });
});
