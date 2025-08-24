import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'local_government_assets', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class LocalGovernmentAssets {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'date' }) report_date: Date;
  @Column({ type: 'text' }) division: string;
  @Column({ type: 'text' }) district: string;

  @Column({ type: 'text', default: 'Local Government' }) department: string;

  // Generic asset fields (works for streets, drains, SWM, streetlights, etc.)
  @Column({ type: 'text', nullable: true }) asset_type: string;     // e.g., Drainage, Street, Footpath, Streetlight
  @Column({ type: 'text', nullable: true }) asset_name: string;     // optional description/name
  @Column({ type: 'text', nullable: true }) nature_of_damage: string;
  @Column({ type: 'text', nullable: true }) restoration_status: string;

  @Column({ type: 'integer', nullable: true }) minorly_damaged_no: number;
  @Column({ type: 'integer', nullable: true }) partially_damaged_no: number;
  @Column({ type: 'integer', nullable: true }) washed_away_no: number;
  @Column({ type: 'integer', nullable: true }) total_projects_no: number;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  estimated_cost_million_pkr: number;

  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'text', nullable: true }) source: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}