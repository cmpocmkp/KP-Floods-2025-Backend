import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AgricultureImpactsService } from './agriculture-impacts.service';
import { AgricultureImpactsDto, AgricultureImpactsFilterDto } from '../dtos/agriculture-impacts.dto';

@ApiTags('Agriculture Impacts')
@Controller('floods/agriculture-impacts')
export class AgricultureImpactsController {
  constructor(private readonly agricultureImpactsService: AgricultureImpactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update agriculture impacts data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: AgricultureImpactsDto) {
    return this.agricultureImpactsService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get agriculture impacts data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: AgricultureImpactsFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.agricultureImpactsService.findAll();
    }
    return this.agricultureImpactsService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agriculture impacts data by ID' })
  async findById(@Param('id') id: string) {
    return this.agricultureImpactsService.findById(id);
  }
}