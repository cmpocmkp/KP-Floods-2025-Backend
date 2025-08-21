import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'User image file name or URL, e.g., "profile.png".',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'First name of the user, e.g., "Jonathan".',
    required: true,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user, e.g., "Charles".',
    required: false,
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description:
      'Email address of the user, e.g., "jonathan.charles@gmail.com".',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user, e.g., "+15555551234".',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone_no?: string;
}
