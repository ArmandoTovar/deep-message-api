import { IsEnum, IsOptional, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '../schemas/message.schema';

export class FilterMessagesDto {
  @IsOptional()
  @IsEnum(MessageStatus, { message: 'Please enter a correct status.' })
  @ApiProperty({
    description: 'Filter messages by status',
    enum: MessageStatus,
    required: false,
  })
  readonly status?: MessageStatus;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    description: 'Filter messages by starred status',
    required: false,
    example: 'true',
  })
  readonly isStarred?: string;
}
