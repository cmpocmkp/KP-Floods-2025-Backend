import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'district_incidents_reported', schema: 'dmis' })
@Index(['report_date'])
@Index(['district'])
@Index(['district', 'report_date'], { unique: true })
export class DistrictIncidentsReported {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'integer' })
  total_deaths: number;

  @Column({ type: 'integer' })
  total_injured: number;

  @Column({ type: 'integer' })
  total_houses_damaged: number;

  @Column({ type: 'integer' })
  total_other_damaged: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}