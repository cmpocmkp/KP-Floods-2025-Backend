import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'cnw_assets', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class CnwAssets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'C&W' })
  department: string;

  @Column({ type: 'integer', nullable: true })
  road_damage_count: number;

  @Column({ type: 'text', nullable: true })
  road_damage_report: string;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  road_damage_length_km: number;

  @Column({ type: 'integer', nullable: true })
  road_fully_restored: number;

  @Column({ type: 'integer', nullable: true })
  road_partially_restored: number;

  @Column({ type: 'integer', nullable: true })
  road_not_restored: number;

  @Column({ type: 'integer', nullable: true })
  bridges_damaged_count: number;

  @Column({ type: 'text', nullable: true })
  bridges_damage_reported: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  bridges_damaged_length_m: number;

  @Column({ type: 'integer', nullable: true })
  bridges_fully_restored: number;

  @Column({ type: 'integer', nullable: true })
  bridges_partially_restored: number;

  @Column({ type: 'integer', nullable: true })
  bridges_not_restored: number;

  @Column({ type: 'integer', nullable: true })
  culverts_damage_count: number;

  @Column({ type: 'text', nullable: true })
  culverts_damage_reports: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  culverts_damage_length_m: number;

  @Column({ type: 'integer', nullable: true })
  culverts_fully_restored: number;

  @Column({ type: 'integer', nullable: true })
  culverts_partially_restored: number;

  @Column({ type: 'integer', nullable: true })
  culverts_not_restored: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}