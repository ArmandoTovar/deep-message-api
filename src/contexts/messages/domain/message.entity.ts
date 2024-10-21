import { PrivateKeyInput } from "crypto";

export interface Message {
    id:string;
    content:string;
    senderId:string;
    receiverId:string;
    status:MessageStatus;
    createdAt:Date;
    updatedAt:Date;
}

export interface MessageFilterParams{
    page:number;
    limit:number;
    status:MessageStatus;
    isStarred:boolean;
}
export enum MessageStatus {
    READ = 'read',
    UNREAD = 'unread',
    STARRED = 'starred',
}