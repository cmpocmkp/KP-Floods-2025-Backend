import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CnwAssetsService } from './cnw-assets.service';
import { CnwAssetsDto, CnwAssetsFilterDto } from '../dtos/cnw-assets.dto';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AuthorizationHeader } from '../../app/swagger.constant';

@ApiTags('C&W Assets')
@ApiBearerAuth(AuthorizationHeader)
@UseGuards(JWTAuthGuard)
@Controller('floods/cnw-assets')
export class CnwAssetsController {
  constructor(private readonly cnwAssetsService: CnwAssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update C&W assets data by district and date' })
  @ApiResponse({ status: 201, description: 'Data upserted successfully' })
  async upsert(@Body() payload: CnwAssetsDto) {
    return this.cnwAssetsService.upsertByDistrictAndDate(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get C&W assets data with optional filters' })
  @ApiQuery({ name: 'division', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getByFilters(@Query() filters: CnwAssetsFilterDto) {
    if (Object.keys(filters).length === 0) {
      return this.cnwAssetsService.findAll();
    }
    return this.cnwAssetsService.getByFilters(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get C&W assets data by ID' })
  async findById(@Param('id') id: string) {
    return this.cnwAssetsService.findById(id);
  }
}