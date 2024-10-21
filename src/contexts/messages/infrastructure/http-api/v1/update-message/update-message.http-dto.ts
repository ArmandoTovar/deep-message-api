import { IsNotEmpty, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from 'src/contexts/messages/domain/message.entity';

export class UpdateMessageHttpDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    description: 'ID of the message',
    example: '60d0fe4f5311236168a109cb',
  })
  readonly id: string;


  @IsNotEmpty()
  @IsEnum(MessageStatus, { message: 'Please enter a correct status.' })
  @ApiProperty({
    description: 'Status of the message',
    enum: MessageStatus,
    example: MessageStatus.READ,
  })
  readonly status: MessageStatus;
}
