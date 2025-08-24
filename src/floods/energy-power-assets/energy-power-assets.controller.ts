import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EnergyPowerAssetsService } from './energy-power-assets.service';
import { EnergyPowerAssetsDto, EnergyPowerAssetsFilterDto } from '../dtos/energy-power-assets.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../../app/swagger.constant';

@ApiTags('Energy & Power Assets')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
@Controller('floods/energy-power-assets')
export class EnergyPowerAssetsController {
  constructor(private readonly energyPowerAssetsService: EnergyPowerAssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update energy & power assets data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: EnergyPowerAssetsDto) {
    return this.energyPowerAssetsService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get energy & power assets data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: EnergyPowerAssetsFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.energyPowerAssetsService.findAll();
    }
    return this.energyPowerAssetsService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get energy & power assets data by ID' })
  async findById(@Param('id') id: string) {
    return this.energyPowerAssetsService.findById(id);
  }
}