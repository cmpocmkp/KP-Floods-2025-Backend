import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LocalGovernmentAssetsService } from './local-government-assets.service';
import { FindLocalGovDto } from '../dtos/query-params.dto';

@ApiTags('Local Government Assets')
@Controller('api/local-government')
export class LocalGovernmentAssetsController {
  constructor(private readonly service: LocalGovernmentAssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get local government assets with filters and pagination' })
  async findAll(@Query() dto: FindLocalGovDto) {
    return this.service.findAll(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get summary of local government assets grouped by district or division' })
  @ApiQuery({ name: 'groupBy', enum: ['district', 'division'], required: false })
  async getSummary(@Query('groupBy') groupBy: 'district' | 'division' = 'district') {
    return this.service.getSummary(groupBy);
  }
}