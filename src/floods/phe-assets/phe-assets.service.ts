import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { PheAssets } from '../entities/phe-assets.entity';
import { FindPheDto } from '../dtos/query-params.dto';

@Injectable()
export class PheAssetsService {
  constructor(
    @InjectRepository(PheAssets)
    private readonly repository: Repository<PheAssets>,
  ) {}

  private buildListQuery(dto: FindPheDto) {
    const query = this.repository.createQueryBuilder('phe');

    if (dto.division) {
      query.andWhere('LOWER(phe.division) = LOWER(:division)', { division: dto.division });
    }

    if (dto.district) {
      query.andWhere('LOWER(phe.district) = LOWER(:district)', { district: dto.district });
    }

    if (dto.date_from) {
      query.andWhere('phe.report_date >= :dateFrom', { dateFrom: dto.date_from });
    }

    if (dto.date_to) {
      query.andWhere('phe.report_date <= :dateTo', { dateTo: dto.date_to });
    }

    if (dto.search) {
      query.andWhere(
        '(LOWER(phe.scheme_name) LIKE LOWER(:search) OR LOWER(phe.nature_of_damage) LIKE LOWER(:search))',
        { search: `%${dto.search}%` }
      );
    }

    return query;
  }

  async findAll(dto: FindPheDto) {
    const query = this.buildListQuery(dto);
    
    const [data, total] = await Promise.all([
      query
        .skip((dto.page - 1) * dto.pageSize)
        .take(dto.pageSize)
        .orderBy('phe.report_date', 'DESC')
        .addOrderBy('phe.district', 'ASC')
        .getMany(),
      query.getCount()
    ]);

    return {
      data,
      page: dto.page,
      pageSize: dto.pageSize,
      total
    };
  }

  async getSummary(groupBy: 'district' | 'division' = 'district') {
    const query = this.repository.createQueryBuilder('phe')
      .select([
        `phe.${groupBy}`,
        'COUNT(phe.id) as total_records',
        'SUM(phe.minorly_damaged_no) as total_minorly_damaged',
        'SUM(phe.partially_damaged_no) as total_partially_damaged',
        'SUM(phe.washed_away_no) as total_washed_away',
        'SUM(phe.total_schemes_no) as total_schemes',
        'SUM(phe.estimated_cost_million_pkr) as total_estimated_cost',
        'COUNT(CASE WHEN phe.damage_status = \'Fully\' THEN 1 END) as fully_damaged',
        'COUNT(CASE WHEN phe.damage_status = \'Partially\' THEN 1 END) as partially_damaged'
      ])
      .groupBy(`phe.${groupBy}`)
      .orderBy(`phe.${groupBy}`, 'ASC');

    return query.getRawMany();
  }
}