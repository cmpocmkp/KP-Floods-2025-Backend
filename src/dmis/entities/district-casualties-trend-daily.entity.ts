import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'district_casualties_trend_daily', schema: 'dmis' })
@Index(['report_date'])
@Index(['district'])
@Index(['district', 'report_date'], { unique: true })
export class DistrictCasualtiesTrendDaily {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'integer' })
  total_deaths: number;

  @Column({ type: 'integer' })
  total_houses_damaged: number;

  @Column({ type: 'integer' })
  cattle_perished: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}