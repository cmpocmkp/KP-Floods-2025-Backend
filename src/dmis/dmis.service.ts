import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { format } from 'date-fns';

import { WarehouseStockSnapshots } from './entities/warehouse-stock-snapshots.entity';
import { WarehouseStockItems } from './entities/warehouse-stock-items.entity';
import { WarehouseItemIssued } from './entities/warehouse-item-issued.entity';
import { WarehouseItemRequested } from './entities/warehouse-item-requested.entity';
import { WarehouseStockByDivision } from './entities/warehouse-stock-by-division.entity';
import { DivisionIncidentSummaries } from './entities/division-incident-summaries.entity';
import { DistrictCasualtiesTrendDaily } from './entities/district-casualties-trend-daily.entity';
import { DistrictIncidentsReported } from './entities/district-incidents-reported.entity';
import { CampsSnapshot } from './entities/camps-snapshot.entity';

import {
  WarehouseStockAtHandResponse,
  WarehouseItemIssuedResponse,
  WarehouseItemRequestedResponse,
  WarehouseStockByDivisionResponse,
  DivisionIncidentSummaryResponse,
  CampsResponse,
  DistrictCasualtiesTrendResponse,
  DistrictIncidentsReportedResponse,
} from './dtos/warehouse-responses.dto';

@Injectable()
export class DmisService {
  private readonly logger = new Logger(DmisService.name);
  private readonly baseUrl = 'https://dmis.pdma.gov.pk/Dashboard';
  private readonly fromDate = format(new Date(2025, 7, 15), 'MM/dd/yyyy'); // August 15, 2025
  private readonly toDate = format(new Date(2025, 7, 20), 'MM/dd/yyyy');   // August 20, 2025

  constructor(
    @InjectRepository(WarehouseStockSnapshots)
    private warehouseStockSnapshotsRepo: Repository<WarehouseStockSnapshots>,
    @InjectRepository(WarehouseStockItems)
    private warehouseStockItemsRepo: Repository<WarehouseStockItems>,
    @InjectRepository(WarehouseItemIssued)
    private warehouseItemIssuedRepo: Repository<WarehouseItemIssued>,
    @InjectRepository(WarehouseItemRequested)
    private warehouseItemRequestedRepo: Repository<WarehouseItemRequested>,
    @InjectRepository(WarehouseStockByDivision)
    private warehouseStockByDivisionRepo: Repository<WarehouseStockByDivision>,
    @InjectRepository(DivisionIncidentSummaries)
    private divisionIncidentSummariesRepo: Repository<DivisionIncidentSummaries>,
    @InjectRepository(DistrictCasualtiesTrendDaily)
    private districtCasualtiesTrendDailyRepo: Repository<DistrictCasualtiesTrendDaily>,
    @InjectRepository(DistrictIncidentsReported)
    private districtIncidentsReportedRepo: Repository<DistrictIncidentsReported>,
    @InjectRepository(CampsSnapshot)
    private campsSnapshotRepo: Repository<CampsSnapshot>,
  ) {}

  private async makeRequest<T>(endpoint: string, data?: any): Promise<T> {
    try {
      this.logger.log(`Making request to ${endpoint} with data: ${JSON.stringify(data)}`);
      const response = await axios.post<T>(`${this.baseUrl}/${endpoint}`, data, {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
      });
      this.logger.log(`Response from ${endpoint}: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch from ${endpoint}: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Response status: ${error.response.status}`);
      }
      throw error;
    }
  }

  async fetchWarehouseStockAtHand() {
    try {
      this.logger.log('Fetching warehouse stock at hand...');
      const today = new Date();
      const response = await this.makeRequest<WarehouseStockAtHandResponse>('GetWarehouseStockAtHand');
      this.logger.log(`Got response with ${response.result.length} items`);

      // Upsert snapshot
      this.logger.log('Upserting warehouse stock snapshot...');
      await this.warehouseStockSnapshotsRepo.upsert(
        {
          report_date: today,
          total_stock_available: response.total_stock_available,
        },
        ['report_date'],
      );

      // Upsert items
      this.logger.log('Upserting warehouse stock items...');
      for (const item of response.result) {
        await this.warehouseStockItemsRepo.upsert(
          {
            report_date: today,
            ...item,
          },
          ['report_date', 'item_title'],
        );
      }
      this.logger.log('Successfully stored warehouse stock data');
    } catch (error) {
      this.logger.error(`Error in fetchWarehouseStockAtHand: ${error.message}`);
      if (error.stack) {
        this.logger.error(error.stack);
      }
      throw error;
    }
  }

  async fetchWarehouseItemIssued() {
    const today = new Date();
    const response = await this.makeRequest<WarehouseItemIssuedResponse>('GetWarehouseItemIssued', {
      from_date: this.fromDate,
      to_date: this.toDate,
    });

    for (const item of response.result) {
      await this.warehouseItemIssuedRepo.upsert(
        {
          report_date: today,
          total_item_issued: response.total_item_issued,
          ...item,
        },
        ['report_date', 'item_title'],
      );
    }
  }

  async fetchWarehouseItemRequested() {
    const today = new Date();
    const response = await this.makeRequest<WarehouseItemRequestedResponse>('GetWarehouseItemRequested', {
      from_date: this.fromDate,
      to_date: this.toDate,
    });

    for (const item of response.result) {
      await this.warehouseItemRequestedRepo.upsert(
        {
          report_date: today,
          total_item_requested: response.total_item_requested,
          ...item,
        },
        ['report_date', 'item_title'],
      );
    }
  }

  async fetchWarehouseStockByDivision() {
    const today = new Date();
    const response = await this.makeRequest<WarehouseStockByDivisionResponse>('GetWarehouseItemStockByDivision', {
      from_date: this.fromDate,
      to_date: this.toDate,
    });

    for (const item of response) {
      await this.warehouseStockByDivisionRepo.upsert(
        {
          report_date: today,
          ...item,
        },
        ['report_date', 'item_title'],
      );
    }
  }

  async fetchDivisionIncidentSummary() {
    const today = new Date();
    const response = await this.makeRequest<DivisionIncidentSummaryResponse[]>('GetTotalIncidentReportedDivisionsSummary', {
      from_date: this.fromDate,
      to_date: this.toDate,
    });

    for (const summary of response) {
      await this.divisionIncidentSummariesRepo.upsert(
        {
          report_date: today,
          division_name: summary.DivisionName,
          total_deaths: summary.TotalDeaths,
          total_injured: summary.TotalInjured,
          total_houses_damaged: summary.TotalHousesDamaged,
          cattle_perished: summary.CattlePerished,
        },
        ['report_date', 'division_name'],
      );
    }
  }

  async fetchAllCamps() {
    const today = new Date();
    const response = await this.makeRequest<CampsResponse>('GetAllCamps');

    for (const item of response.result) {
      await this.campsSnapshotRepo.upsert(
        {
          report_date: today,
          total_camps: response.total_camps,
          ...item,
        },
        ['report_date', 'item_title'],
      );
    }
  }

  async fetchDistrictCasualtiesTrend() {
    const today = new Date();
    const response = await this.makeRequest<DistrictCasualtiesTrendResponse[]>(
      'GetDistrictWiseCasualitiesTrendForLast7DaysRMS',
      {
        from_date: this.fromDate,
        to_date: this.toDate,
      },
    );

    for (const trend of response) {
      await this.districtCasualtiesTrendDailyRepo.upsert(
        {
          report_date: new Date(trend.ReportDate),
          district: trend.DistrictName,
          total_deaths: trend.TotalDeaths,
          total_houses_damaged: trend.TotalHousesDamaged,
          cattle_perished: trend.CattlePerished,
        },
        ['report_date', 'district'],
      );
    }
  }

  async fetchDistrictIncidentsReported() {
    const today = new Date();
    const response = await this.makeRequest<DistrictIncidentsReportedResponse[]>('GetDistrictWiseIncidentReportedRMS', {
      from_date: this.fromDate,
      to_date: this.toDate,
    });

    for (const incident of response) {
      await this.districtIncidentsReportedRepo.upsert(
        {
          report_date: today,
          district: incident.DistrictName,
          total_deaths: incident.TotalDeaths,
          total_injured: incident.TotalInjured,
          total_houses_damaged: incident.TotalHousesDamaged,
          total_other_damaged: incident.TotalOtherDamaged,
        },
        ['report_date', 'district'],
      );
    }
  }
}