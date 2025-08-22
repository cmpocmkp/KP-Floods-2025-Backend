import {
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserOnboardingDto {
  @ApiProperty({ description: 'Description or bio of the user', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Jurisdiction of the user', required: false })
  @IsString()
  @IsOptional()
  jurisdiction?: string;

  @ApiProperty({ description: 'Mark if this is first login', required: false })
  @IsBoolean()
  @IsOptional()
  first_login?: boolean;
}
