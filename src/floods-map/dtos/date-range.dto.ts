import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2025-08-14',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_from?: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2025-08-20',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date_to?: string;
}