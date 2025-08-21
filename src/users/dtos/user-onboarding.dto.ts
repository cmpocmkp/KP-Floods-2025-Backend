import {
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserOnboardingDto {
  @ApiProperty({ description: 'City of the user', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'State of the user', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Country of the user', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Date of birth of the user',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiProperty({
    description: 'Gender of the user',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;
}
