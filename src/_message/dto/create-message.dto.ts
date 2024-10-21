import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    description: 'ID of the user receiving the message',
    example: '60d0fe4f5311236168a109cb',
  })
  readonly receiver: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  readonly content: string;
}
