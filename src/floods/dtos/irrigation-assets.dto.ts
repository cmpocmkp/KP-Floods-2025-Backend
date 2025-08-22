import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IrrigationAssetsDto {
  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  report_date: string;

  @ApiProperty({ example: 'Peshawar' })
  @IsString()
  division: string;

  @ApiProperty({ example: 'Nowshera' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Irrigation', required: false })
  @IsOptional()
  @IsString()
  name_of_department?: string;

  @ApiProperty({ example: 'Canal infrastructure', required: false })
  @IsOptional()
  @IsString()
  type_of_infrastructure_damaged?: string;

  @ApiProperty({ example: 'Main canal section A', required: false })
  @IsOptional()
  @IsString()
  specific_name_description?: string;

  @ApiProperty({ example: '2km length, 5m width', required: false })
  @IsOptional()
  @IsString()
  damaged_size_length_area?: string;

  @ApiProperty({ example: 'Under repair', required: false })
  @IsOptional()
  @IsString()
  restoration_status?: string;

  @ApiProperty({ example: 15.75, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  approx_short_term_restoration_cost_m?: number;

  @ApiProperty({ example: 45.50, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  approx_complete_rehab_cost_m?: number;

  @ApiProperty({ example: 'Irrigation infrastructure damage notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'Irrigation Department', required: false })
  @IsOptional()
  @IsString()
  source?: string;
}

export class IrrigationAssetsFilterDto {
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