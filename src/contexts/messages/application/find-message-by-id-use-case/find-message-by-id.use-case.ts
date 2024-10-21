
import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { MessageNotFoundException } from "../../domain/message-not-found.exception";
import { MessageOperation, MessageUnauthorizedException } from "../../domain/message-unauthorized.exception";
import { Message } from "../../domain/message.entity";
import { MessageRepository } from "../../domain/message.repository";
import { FindMessageByIdDto } from "./find-message-by-id.dto";



@Injectable()
export class FindMessageByIdUseCase {
    constructor(private readonly messageRepository: MessageRepository) {}

    async execute(params: FindMessageByIdDto): Promise<Message> {
        const message = await this.messageRepository.findMessageById(params.id);
        if (!message) {
            throw new MessageNotFoundException(params.id);
        }
        let messageToUpdate = message
        
        if (params.target !== messageToUpdate.receiverId && params.target !== messageToUpdate.senderId) {    
            throw new MessageUnauthorizedException({operation: MessageOperation.GET, id: params.id});
        }
        return message;
    }
}