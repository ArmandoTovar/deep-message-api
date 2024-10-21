


export interface ExceptionMessage{
    operation:MessageOperation
    id:string
}

export enum MessageOperation {
    DELETE = 'delete',
    UPDATE = 'update',
    CREATE = 'create',
    GET = 'get'    
}   

export class MessageUnauthorizedException extends Error {
    constructor(public readonly exectionMessage: ExceptionMessage) {
        super(`Message with id ${exectionMessage.id} can't be ${exectionMessage.operation} by current user`);
    }
}