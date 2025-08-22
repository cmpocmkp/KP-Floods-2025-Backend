import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'agriculture_impacts', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class AgricultureImpacts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Agriculture' })
  department: string;

  @Column({ type: 'integer', nullable: true })
  structural_damages_no: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  crop_mask_acre: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  damaged_area_gis_acre: number;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  onground_verified_acre: number;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  estimated_losses_million_pkr: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}