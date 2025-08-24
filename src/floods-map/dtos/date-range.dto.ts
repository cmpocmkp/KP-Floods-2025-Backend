import { IsDateString, IsOptional, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotFutureDateConstraint } from './common-params.dto';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-03-14',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Validate(IsNotFutureDateConstraint)
  date_from?: string;

  @ApiProperty({
    description: 'End date (YYYY-MM-DD)',
    example: '2024-03-20',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Validate(IsNotFutureDateConstraint)
  date_to?: string;
}