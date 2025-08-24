import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { HousingImpactsService } from './housing-impacts.service';
import { HousingImpactsDto, HousingImpactsFilterDto } from '../dtos/housing-impacts.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../../app/swagger.constant';

@ApiTags('Housing Impacts')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
@Controller('floods/housing-impacts')
export class HousingImpactsController {
  constructor(private readonly housingImpactsService: HousingImpactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update housing impacts data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: HousingImpactsDto) {
    return this.housingImpactsService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get housing impacts data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: HousingImpactsFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.housingImpactsService.findAll();
    }
    return this.housingImpactsService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get housing impacts data by ID' })
  async findById(@Param('id') id: string) {
    return this.housingImpactsService.findById(id);
  }
}