import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LivestockLossesService } from './livestock-losses.service';
import { LivestockLossesDto, LivestockLossesFilterDto } from '../dtos/livestock-losses.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../../app/swagger.constant';

@ApiTags('Livestock Losses')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
@Controller('floods/livestock-losses')
export class LivestockLossesController {
  constructor(private readonly livestockLossesService: LivestockLossesService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update livestock losses data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: LivestockLossesDto) {
    return this.livestockLossesService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get livestock losses data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: LivestockLossesFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.livestockLossesService.findAll();
    }
    return this.livestockLossesService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get livestock losses data by ID' })
  async findById(@Param('id') id: string) {
    return this.livestockLossesService.findById(id);
  }
}