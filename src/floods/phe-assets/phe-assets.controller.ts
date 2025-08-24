import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PheAssetsService } from './phe-assets.service';
import { FindPheDto } from '../dtos/query-params.dto';

@ApiTags('PHE Assets')
@Controller('api/phe')
export class PheAssetsController {
  constructor(private readonly service: PheAssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get PHE assets with filters and pagination' })
  async findAll(@Query() dto: FindPheDto) {
    return this.service.findAll(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary of PHE assets grouped by district or division' })
  @ApiQuery({ name: 'groupBy', enum: ['district', 'division'], required: false })
  async getSummary(@Query('groupBy') groupBy: 'district' | 'division' = 'district') {
    return this.service.getSummary(groupBy);
  }
}