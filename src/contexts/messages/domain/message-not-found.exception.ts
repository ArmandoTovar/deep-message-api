export class MessageNotFoundException extends Error {
    constructor(public readonly id: string) {
        super(`Message with id ${id} not found`);
    }
}