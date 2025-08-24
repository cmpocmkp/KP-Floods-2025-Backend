import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverviewController } from './controllers/overview.controller';
import { DistributionController } from './controllers/distribution.controller';
import { SummariesController } from './controllers/summaries.controller';
import { TrendsController } from './controllers/trends.controller';
import { OverviewService } from './services/overview.service';
import { DistributionService } from './services/distribution.service';
import { SummariesService } from './services/summaries.service';
import { TrendsService } from './services/trends.service';
import { DistrictIncidentsReported } from '../dmis/entities/district-incidents-reported.entity';
import { DistrictCasualtiesTrendDaily } from '../dmis/entities/district-casualties-trend-daily.entity';
import { EsedSchoolDamages } from '../floods/entities/esed-school-damages.entity';
import { LivestockLosses } from '../floods/entities/livestock-losses.entity';
import { HousingImpacts } from '../floods/entities/housing-impacts.entity';
import { CnwAssets } from '../floods/entities/cnw-assets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DistrictIncidentsReported,
      DistrictCasualtiesTrendDaily,
      EsedSchoolDamages,
      LivestockLosses,
      HousingImpacts,
      CnwAssets,
    ]),
  ],
  controllers: [
    OverviewController,
    DistributionController,
    SummariesController,
    TrendsController,
  ],
  providers: [
    OverviewService,
    DistributionService,
    SummariesService,
    TrendsService,
  ],
})
export class ApiModule {}