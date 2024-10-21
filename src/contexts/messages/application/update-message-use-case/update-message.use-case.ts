
import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { MessageNotFoundException } from "../../domain/message-not-found.exception";
import { MessageOperation, MessageUnauthorizedException } from "../../domain/message-unauthorized.exception";
import { Message } from "../../domain/message.entity";
import { MessageRepository } from "../../domain/message.repository";
import { UpdateMessageDto } from "./update-message.dto";


@Injectable()
export class UpdateMessageUseCase {
    constructor(private readonly messageRepository: MessageRepository) {}
  
    async execute(updateMessage: UpdateMessageDto): Promise<Message> {
        const message = await this.messageRepository.findMessageById(updateMessage.id);
        if (!message) {
            throw new MessageNotFoundException(updateMessage.id);
        }
        let messageToUpdate = message
        
        if (updateMessage.receiverId !== messageToUpdate.receiverId) {    
            throw new MessageUnauthorizedException({operation: MessageOperation.UPDATE, id: updateMessage.id});
        }

        return this.messageRepository.updateMessageStatus(updateMessage.id, updateMessage.status);
    }
}