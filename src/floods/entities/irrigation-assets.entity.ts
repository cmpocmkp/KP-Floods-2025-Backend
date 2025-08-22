import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'irrigation_assets', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class IrrigationAssets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Irrigation' })
  name_of_department: string;

  @Column({ type: 'text', nullable: true })
  type_of_infrastructure_damaged: string;

  @Column({ type: 'text', nullable: true })
  specific_name_description: string;

  @Column({ type: 'text', nullable: true })
  damaged_size_length_area: string;

  @Column({ type: 'text', nullable: true })
  restoration_status: string;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  approx_short_term_restoration_cost_m: number;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  approx_complete_rehab_cost_m: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}