import { IsString, IsNotEmpty, MinLength, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {

  @ApiProperty({
    description: 'OTP received for password reset.',
    example: '123456',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'OTP received for password reset.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'New password for the user.',
    example: 'newSecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
