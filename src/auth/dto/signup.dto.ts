import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: true,
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @ApiProperty({
    description: 'Roles assigned to the user',
    example: ['user', 'admin'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Roles must be an array of strings' })
  @ArrayNotEmpty({ message: 'Roles array must not be empty' })
  readonly role?: string[];
}
