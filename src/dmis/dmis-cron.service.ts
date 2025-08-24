import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DmisService } from './dmis.service';

@Injectable()
export class DmisCronService {
  private readonly logger = new Logger(DmisCronService.name);

  constructor(private readonly dmisService: DmisService) {}

  @Cron('0 6,18 * * *', { timeZone: 'Asia/Karachi' })
  async handleCron() {
    this.logger.log('Starting DMIS data fetch cron job');

    try {
      await this.dmisService.fetchWarehouseStockAtHand();
      this.logger.log('Successfully fetched warehouse stock at hand');

      await this.dmisService.fetchWarehouseItemIssued();
      this.logger.log('Successfully fetched warehouse items issued');

      await this.dmisService.fetchWarehouseItemRequested();
      this.logger.log('Successfully fetched warehouse items requested');

      await this.dmisService.fetchWarehouseStockByDivision();
      this.logger.log('Successfully fetched warehouse stock by division');

      await this.dmisService.fetchDivisionIncidentSummary();
      this.logger.log('Successfully fetched division incident summary');

      await this.dmisService.fetchAllCamps();
      this.logger.log('Successfully fetched all camps');

      await this.dmisService.fetchDistrictCasualtiesTrend();
      this.logger.log('Successfully fetched district casualties trend');

      await this.dmisService.fetchDistrictIncidentsReported();
      this.logger.log('Successfully fetched district incidents reported');

      this.logger.log('Completed DMIS data fetch cron job');
    } catch (error) {
      this.logger.error('Failed to complete DMIS data fetch cron job', error.stack);
    }
  }
}