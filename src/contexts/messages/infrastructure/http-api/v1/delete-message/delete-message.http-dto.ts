import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMessageHttpDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    description: 'ID of the message',
    example: '60d0fe4f5311236168a109cb',
  })
  readonly id: string;
}
