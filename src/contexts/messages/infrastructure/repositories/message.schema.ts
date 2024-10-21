import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { MessageStatus } from '../../domain/message.entity';

@Schema({
  timestamps: true,
})
export class MessageEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: User;

  @Prop()
  content: string;

  @Prop({ enum: MessageStatus, default: MessageStatus.UNREAD })
  status: MessageStatus;

  @Prop({ default: false })
  isStarred: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageEntity);
