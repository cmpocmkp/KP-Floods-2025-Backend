import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({
    description: 'Username/User ID',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  @IsString()
  password: string;
}