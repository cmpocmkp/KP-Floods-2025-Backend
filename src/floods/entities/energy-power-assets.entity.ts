import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'energy_power_assets', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class EnergyPowerAssets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Energy & Power' })
  department: string;

  @Column({ type: 'text', nullable: true })
  damages_nature: string;

  @Column({ type: 'integer', nullable: true })
  minorly_damaged_no: number;

  @Column({ type: 'integer', nullable: true })
  partially_damaged_no: number;

  @Column({ type: 'integer', nullable: true })
  washed_away_no: number;

  @Column({ type: 'integer', nullable: true })
  total_projects_no: number;

  @Column({ type: 'numeric', precision: 16, scale: 3, nullable: true })
  total_capacity_kw: number;

  @Column({ type: 'numeric', precision: 16, scale: 3, nullable: true })
  below_200kw: number;

  @Column({ type: 'numeric', precision: 16, scale: 3, nullable: true })
  kw_200_and_above: number;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  estimated_cost_rehab_protection_million_pkr: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}