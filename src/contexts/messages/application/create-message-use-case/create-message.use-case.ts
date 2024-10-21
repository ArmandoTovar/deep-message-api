import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { Message } from "../../domain/message.entity";
import { MessageRepository } from "../../domain/message.repository";
import { CreateMessageDto } from "./create-message.dto";


@Injectable()
export class CreateMessageUseCase {
    constructor(private readonly messageRepository: MessageRepository) {}
    async execute(message: CreateMessageDto): Promise<Message> {
        return this.messageRepository.sendMessage(message);
    }
}