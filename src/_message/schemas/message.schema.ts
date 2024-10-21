import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum MessageStatus {
  READ = 'read',
  UNREAD = 'unread',
  STARRED = 'starred',
}

@Schema({
  timestamps: true,
})
export class Message {
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
}

export const MessageSchema = SchemaFactory.createForClass(Message);
