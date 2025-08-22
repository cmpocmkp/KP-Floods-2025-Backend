import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HousingImpactsDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Housing', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  houses_destroyed_fully?: number;

  @ApiProperty({ example: 300, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  houses_destroyed_partially?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  shops_destroyed?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  petrol_pumps_destroyed?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  religious_places?: number;

  @ApiProperty({ example: 'Housing damage assessment', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Housing Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class HousingImpactsFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}