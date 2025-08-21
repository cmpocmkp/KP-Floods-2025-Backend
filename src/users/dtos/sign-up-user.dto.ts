import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty({
    description: 'User image file name or URL, e.g., "profile.png".',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    description: 'First name of the user, e.g., "Jonathan".',
    required: true,
    default: '',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user, e.g., "Charles".',
    required: true,
    default: '',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    description:
      'Email address of the user, e.g., "jonathan.charles@gmail.com".',
    required: true,
    default: '',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Country code for the phone number, e.g., "+1".',
    required: true,
    default: '',
  })
  @IsString()
  country_code: string;

  @ApiProperty({
    description: 'Phone number of the user, e.g., "+15555551234".',
    required: true,
    default: '',
  })
  @IsPhoneNumber(null, { message: 'Invalid phone number' })
  phone_no: string;

  @ApiProperty({
    description: 'Password for the user account.',
    required: true,
    default: '',
  })
  @IsString()
  password: string;
}
