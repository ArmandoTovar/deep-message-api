
import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { MessageNotFoundException } from "../../domain/message-not-found.exception";
import { MessageOperation, MessageUnauthorizedException } from "../../domain/message-unauthorized.exception";
import { MessageRepository } from "../../domain/message.repository";
import { DeleteMessageDto } from "./delete-message.dto";

@Injectable()
export class DeleteMessageUseCase {
    constructor(private readonly messageRepository: MessageRepository) {}
  
    async execute( deleteMessage:DeleteMessageDto ): Promise<{ deleted: boolean }> {
        const message = await this.messageRepository.findMessageById(deleteMessage.id);
        if (!message) {
            throw new MessageNotFoundException(deleteMessage.id);
        }
        let messageToDelete = message
        
        if (deleteMessage.senderId !== messageToDelete.senderId) {    
            throw new MessageUnauthorizedException({operation: MessageOperation.DELETE, id: messageToDelete.id});
        }
        return this.messageRepository.deleteMessage(deleteMessage.id);
    }
}
