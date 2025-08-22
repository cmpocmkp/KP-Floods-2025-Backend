import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty({
    description: 'Unique user identifier, e.g., "admin001".',
    required: true,
    maxLength: 50,
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Display name of the user, e.g., "John Admin".',
    required: true,
    maxLength: 255,
  })
  @IsString()
  user_name: string;

  @ApiProperty({
    description: 'Email address of the user, e.g., "admin@example.com".',
    required: false,
    maxLength: 255,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Description or bio of the user.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Jurisdiction or area of responsibility, e.g., "Peshawar Division".',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  jurisdiction?: string;

  @ApiProperty({
    description: 'Role of the user in the system.',
    enum: ['super_admin', 'admin', 'admin_staff'],
    required: true,
  })
  @IsEnum(['super_admin', 'admin', 'admin_staff'])
  role: string;

  @ApiProperty({
    description: 'Password for the user account.',
    required: true,
    maxLength: 255,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Initial password for first-time login.',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  initial_password?: string;

  @ApiProperty({
    description: 'ID of the user who created this user.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  created_by?: number;

  @ApiProperty({
    description: 'Data ID for categorization.',
    required: false,
    default: 4,
  })
  @IsNumber()
  @IsOptional()
  data_id?: number;
}
