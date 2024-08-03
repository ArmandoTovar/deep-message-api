import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { FilterMessagesDto } from './dto/filter-message.dto';
import { AuthGuard } from '@nestjs/passport';
import { getModelToken } from '@nestjs/mongoose';
import { MessageStatus } from './schemas/message.schema';
import { RolesGuard } from '../auth/guards/roles.guard';

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

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  const mockMessageService = {
    filterMessages: jest.fn().mockImplementation((dto, query) => {
      return [{
        sender: mockUser,
        receiver: mockUser2,
        content: 'Test message',
        status: MessageStatus.UNREAD,
        isStarred: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
    }),
    sendMessage: jest.fn().mockImplementation((userId, dto) => ({
      sender: mockUser,
      receiver: mockUser2,
      content: dto.content,
      status: MessageStatus.UNREAD,
      isStarred: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findMessageById: jest.fn().mockImplementation((id) => ({
      sender: mockUser,
      receiver: mockUser2,
      content: 'Test message',
      status: MessageStatus.UNREAD,
      isStarred: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateMessageStatus: jest.fn().mockImplementation((id, dto) => ({
      sender: mockUser,
      receiver: mockUser2,
      content: 'Test message',
      status: dto.status,
      isStarred: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    deleteMessageById: jest.fn().mockImplementation((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: getModelToken('Message'),
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('filterMessages', () => {
    it('should return an array of messages', async () => {
      const filterMessagesDto: FilterMessagesDto = {};
      const query = {};
      expect(await controller.filterMessages(filterMessagesDto, query)).toEqual([
        {
          sender: mockUser,
          receiver: mockUser2,
          content: 'Test message',
          status: MessageStatus.UNREAD,
          isStarred: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
      expect(service.filterMessages).toHaveBeenCalledWith(filterMessagesDto, query);
    });
  });

  describe('sendMessage', () => {
    it('should create and return a message', async () => {
      const createMessageDto: CreateMessageDto = { receiver: mockUser2._id, content: 'Test message' };
      const req = { user: mockUser } as any;
      expect(await controller.sendMessage(createMessageDto, req)).toEqual({
        sender: mockUser,
        receiver: mockUser2,
        content: 'Test message',
        status: MessageStatus.UNREAD,
        isStarred: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.sendMessage).toHaveBeenCalledWith(mockUser._id, createMessageDto);
    });
  });

  describe('getMessage', () => {
    it('should return a message', async () => {
      const id = 'messageId';
      expect(await controller.getMessage(id)).toEqual({
        sender: mockUser,
        receiver: mockUser2,
        content: 'Test message',
        status: MessageStatus.UNREAD,
        isStarred: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.findMessageById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateMessageStatus', () => {
    it('should update and return a message', async () => {
      const id = 'messageId';
      const updateMessageStatusDto: UpdateMessageStatusDto = { status: MessageStatus.READ };
      expect(await controller.updateMessageStatus(id, updateMessageStatusDto)).toEqual({
        sender: mockUser,
        receiver: mockUser2,
        content: 'Test message',
        status: MessageStatus.READ,
        isStarred: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.updateMessageStatus).toHaveBeenCalledWith(id, updateMessageStatusDto);
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message and return the result', async () => {
      const id = 'messageId';
      expect(await controller.deleteMessage(id)).toEqual({ deleted: true });
      expect(service.deleteMessageById).toHaveBeenCalledWith(id);
    });
  });
});
