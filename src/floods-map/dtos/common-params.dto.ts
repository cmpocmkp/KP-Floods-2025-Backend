import { IsDateString, IsOptional, IsEnum, IsBoolean, IsString, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    if (!date) return true; // Skip validation if date is not provided
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return inputDate <= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date cannot be in the future';
  }
}

export enum GroupByPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export class CommonQueryParams {
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

  @ApiProperty({
    description: 'Group results by period',
    enum: GroupByPeriod,
    required: false,
  })
  @IsEnum(GroupByPeriod)
  @IsOptional()
  group_by?: GroupByPeriod;

  @ApiProperty({
    description: 'Fill missing dates with zero values',
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  fill_missing?: boolean;

  @ApiProperty({
    description: 'Filter by division',
    required: false,
  })
  @IsString()
  @IsOptional()
  division?: string;

  @ApiProperty({
    description: 'Filter by district',
    required: false,
  })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({
    description: 'Return only latest record per district',
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  latest_only?: boolean;
}