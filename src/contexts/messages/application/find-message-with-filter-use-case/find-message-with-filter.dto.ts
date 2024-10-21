import { MessageStatus } from "../../domain/message.entity";

export interface FindMessageWithFilterDto{
  page?:number;
  limit?:number;
  status?:MessageStatus;
  isStarred?:boolean;
  target:string;
}