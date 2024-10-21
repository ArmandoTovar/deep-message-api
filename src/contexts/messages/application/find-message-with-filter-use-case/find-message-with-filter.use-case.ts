
import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { MessageOperation, MessageUnauthorizedException } from "../../domain/message-unauthorized.exception";
import { Message } from "../../domain/message.entity";
import { MessageRepository } from "../../domain/message.repository";
import { FindMessageWithFilterDto } from "./find-message-with-filter.dto";



@Injectable()
export class FindMessageWithFilterUseCase {
    constructor(private readonly messageRepository: MessageRepository) {}

    async execute(params: FindMessageWithFilterDto): Promise<Message[]> {
        const messages = await this.messageRepository.findAllMessageWithfilter({  
                page: params.page,
                limit: params.limit,
                status: params.status,
                isStarred: params.isStarred});
        return messages.filter(message => params.target == message.receiverId || params.target == message.senderId )

    }
}