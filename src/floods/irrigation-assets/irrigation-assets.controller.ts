import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IrrigationAssetsService } from './irrigation-assets.service';
import { IrrigationAssetsDto, IrrigationAssetsFilterDto } from '../dtos/irrigation-assets.dto';

@ApiTags('Irrigation Assets')
@Controller('floods/irrigation-assets')
export class IrrigationAssetsController {
  constructor(private readonly irrigationAssetsService: IrrigationAssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update irrigation assets data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: IrrigationAssetsDto) {
    return this.irrigationAssetsService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get irrigation assets data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: IrrigationAssetsFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.irrigationAssetsService.findAll();
    }
    return this.irrigationAssetsService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get irrigation assets data by ID' })
  async findById(@Param('id') id: string) {
    return this.irrigationAssetsService.findById(id);
  }
}