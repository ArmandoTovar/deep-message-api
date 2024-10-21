import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from 'src/auth/auth.module';
import { CreateMessageController } from './http-api/v1/create-message/create-message.controller';
import { UpdateMessageController } from './http-api/v1/update-message/update-message.controller';
import { DeleteMessageController } from './http-api/v1/delete-message/delete-message.controller';
import { MessageSchema } from './repositories/message.schema';
import { CreateMessageUseCase } from '../application/create-message-use-case/create-message.use-case';
import { DeleteMessageUseCase } from '../application/delete-message-use-case/delete-message.use-case';
import { UpdateMessageUseCase } from '../application/update-message-use-case/update-message.use-case';
import { FindMessageByIdUseCase } from '../application/find-message-by-id-use-case/find-message-by-id.use-case';
import { FindMessageWithFilterUseCase } from '../application/find-message-with-filter-use-case/find-message-with-filter.use-case';
import { MessageRepository } from '../domain/message.repository';
import { MongoMessageRepository } from './repositories/mongo.message-repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'MessageEntity', schema: MessageSchema }]),
  ],
  controllers: [CreateMessageController,UpdateMessageController,DeleteMessageController],
  providers: [
    CreateMessageUseCase,
    DeleteMessageUseCase,
    UpdateMessageUseCase,
    FindMessageByIdUseCase,
    FindMessageWithFilterUseCase,
    MongoMessageRepository,
    {
      provide: MessageRepository,
      useExisting: MongoMessageRepository
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CreateMessageUseCase,
    DeleteMessageUseCase,
    UpdateMessageUseCase,
    FindMessageByIdUseCase,
    FindMessageWithFilterUseCase,],
})
export class MessageModule {}
