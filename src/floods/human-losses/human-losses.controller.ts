import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { HumanLossesService } from './human-losses.service';
import { HumanLossesDto, HumanLossesFilterDto } from '../dtos/human-losses.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../../app/swagger.constant';

@ApiTags('Human Losses')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
@Controller('floods/human-losses')
export class HumanLossesController {
  constructor(private readonly humanLossesService: HumanLossesService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update human losses data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: HumanLossesDto) {
    return this.humanLossesService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get human losses data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: HumanLossesFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.humanLossesService.findAll();
    }
    return this.humanLossesService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get human losses data by ID' })
  async findById(@Param('id') id: string) {
    return this.humanLossesService.findById(id);
  }
}