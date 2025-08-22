import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { CnwAssets } from '../entities/cnw-assets.entity';
import { CnwAssetsDto, CnwAssetsFilterDto } from '../dtos/cnw-assets.dto';

@Injectable()
export class CnwAssetsService {
  constructor(
    @InjectRepository(CnwAssets)
    private readonly cnwAssetsRepository: Repository<CnwAssets>,
  ) {}

  async upsertByDistrictAndDate(payload: CnwAssetsDto): Promise<CnwAssets> {
    const { district, report_date, ...updateData } = payload;

    const existingRecord = await this.cnwAssetsRepository.findOne({
      where: { district, report_date: new Date(report_date) },
    });

    if (existingRecord) {
      await this.cnwAssetsRepository.update(
        { id: existingRecord.id },
        { ...updateData, report_date: new Date(report_date) }
      );
      return this.cnwAssetsRepository.findOne({ where: { id: existingRecord.id } });
    } else {
      const newRecord = this.cnwAssetsRepository.create({
        ...payload,
        report_date: new Date(report_date),
      });
      return this.cnwAssetsRepository.save(newRecord);
    }
  }

  async getByFilters(filters: CnwAssetsFilterDto): Promise<CnwAssets[]> {
    const { division, district, dateFrom, dateTo } = filters;
    
    const whereConditions: FindOptionsWhere<CnwAssets> = {};

    if (division) whereConditions.division = division;
    if (district) whereConditions.district = district;

    if (dateFrom && dateTo) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.report_date = Between(new Date(dateFrom), new Date());
    } else if (dateTo) {
      whereConditions.report_date = Between(new Date('1900-01-01'), new Date(dateTo));
    }

    return this.cnwAssetsRepository.find({
      where: whereConditions,
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findAll(): Promise<CnwAssets[]> {
    return this.cnwAssetsRepository.find({
      order: { report_date: 'DESC', district: 'ASC' },
    });
  }

  async findById(id: string): Promise<CnwAssets> {
    return this.cnwAssetsRepository.findOne({ where: { id } });
  }
}