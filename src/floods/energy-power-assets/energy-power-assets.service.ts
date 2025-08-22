import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { EnergyPowerAssets } from '../entities/energy-power-assets.entity';
import { EnergyPowerAssetsDto, EnergyPowerAssetsFilterDto } from '../dtos/energy-power-assets.dto';

@Injectable()
export class EnergyPowerAssetsService {
  constructor(
    @InjectRepository(EnergyPowerAssets)
    private readonly energyPowerAssetsRepository: Repository<EnergyPowerAssets>,
  ) {}

  async upsertByDistrictAndDate(payload: EnergyPowerAssetsDto): Promise<EnergyPowerAssets> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.energyPowerAssetsRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.energyPowerAssetsRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.energyPowerAssetsRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.energyPowerAssetsRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.energyPowerAssetsRepository.save(newRecord);
    }
  }

  async getByFilters(filters: EnergyPowerAssetsFilterDto): Promise<EnergyPowerAssets[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<EnergyPowerAssets> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.energyPowerAssetsRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<EnergyPowerAssets[]> {
    return this.energyPowerAssetsRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<EnergyPowerAssets> {
    return this.energyPowerAssetsRepository.findOne({ where: { id } });
  }
}