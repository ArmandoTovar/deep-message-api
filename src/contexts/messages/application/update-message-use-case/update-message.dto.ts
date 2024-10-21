import { MessageStatus } from "../../domain/message.entity"

export interface UpdateMessageDto{
    id:string
    status:MessageStatus
    receiverId:string
}