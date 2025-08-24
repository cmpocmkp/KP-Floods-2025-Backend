import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { LocalGovernmentAssets } from '../entities/local-government-assets.entity';
import { FindLocalGovDto } from '../dtos/query-params.dto';

@Injectable()
export class LocalGovernmentAssetsService {
  constructor(
    @InjectRepository(LocalGovernmentAssets)
    private readonly repository: Repository<LocalGovernmentAssets>,
  ) {}

  private buildListQuery(dto: FindLocalGovDto) {
    const query = this.repository.createQueryBuilder('lg');

    if (dto.division) {
      query.andWhere('LOWER(lg.division) = LOWER(:division)', { division: dto.division });
    }

    if (dto.district) {
      query.andWhere('LOWER(lg.district) = LOWER(:district)', { district: dto.district });
    }

    if (dto.date_from) {
      query.andWhere('lg.report_date >= :dateFrom', { dateFrom: dto.date_from });
    }

    if (dto.date_to) {
      query.andWhere('lg.report_date <= :dateTo', { dateTo: dto.date_to });
    }

    if (dto.search) {
      query.andWhere(
        '(LOWER(lg.asset_name) LIKE LOWER(:search) OR LOWER(lg.nature_of_damage) LIKE LOWER(:search))',
        { search: `%${dto.search}%` }
      );
    }

    return query;
  }

  async findAll(dto: FindLocalGovDto) {
    const query = this.buildListQuery(dto);
    
    // Ensure page and pageSize are numbers with defaults
    const page = dto.page ? Number(dto.page) : 1;
    const pageSize = dto.pageSize ? Number(dto.pageSize) : 50;
    
    const [data, total] = await Promise.all([
      query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .orderBy('lg.report_date', 'DESC')
        .addOrderBy('lg.district', 'ASC')
        .getMany(),
      query.getCount()
    ]);

    return {
      data,
      page,
      pageSize,
      total
    };
  }

  async getSummary(groupBy: 'district' | 'division' = 'district') {
    const query = this.repository.createQueryBuilder('lg')
      .select([
        `lg.${groupBy}`,
        'COUNT(lg.id) as total_records',
        'SUM(lg.minorly_damaged_no) as total_minorly_damaged',
        'SUM(lg.partially_damaged_no) as total_partially_damaged',
        'SUM(lg.washed_away_no) as total_washed_away',
        'SUM(lg.total_projects_no) as total_projects',
        'SUM(lg.estimated_cost_million_pkr) as total_estimated_cost'
      ])
      .groupBy(`lg.${groupBy}`)
      .orderBy(`lg.${groupBy}`, 'ASC');

    return query.getRawMany();
  }
}