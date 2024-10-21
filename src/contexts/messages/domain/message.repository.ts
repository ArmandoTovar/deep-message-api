import { Message, MessageFilterParams, MessageStatus } from "./message.entity";


export abstract class MessageRepository {
    abstract sendMessage(message: Partial<Message>): Promise<Message>;
    abstract findAllMessageWithfilter(filterMessagesDto: MessageFilterParams): Promise<Message[]>;
    abstract findMessageById(id: string): Promise<Message| null>;
    abstract updateMessageStatus(id: string, status: MessageStatus): Promise<Message>;
    abstract deleteMessage(id: string): Promise<{ deleted: boolean }>;
}