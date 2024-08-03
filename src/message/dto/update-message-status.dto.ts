import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '../schemas/message.schema';

export class UpdateMessageStatusDto {
  @IsNotEmpty()
  @IsEnum(MessageStatus, { message: 'Please enter a correct status.' })
  @ApiProperty({
    description: 'Status of the message',
    enum: MessageStatus,
    example: MessageStatus.READ,
  })
  readonly status: MessageStatus;
}
