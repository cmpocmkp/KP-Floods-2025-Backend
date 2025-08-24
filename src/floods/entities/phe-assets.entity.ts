import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'phe_assets', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class PheAssets {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'date' }) report_date: Date;
  @Column({ type: 'text' }) division: string;
  @Column({ type: 'text' }) district: string;

  @Column({ type: 'text', default: 'PHE' }) department: string;

  @Column({ type: 'text', nullable: true }) tehsil: string;
  @Column({ type: 'text', nullable: true }) uc: string;

  @Column({ type: 'text', nullable: true }) type_of_scheme: string;  // Water Supply, Tube Well, Hand Pump, Gravity, etc.
  @Column({ type: 'text', nullable: true }) scheme_name: string;

  @Column({ type: 'text', nullable: true }) nature_of_damage: string;
  @Column({ type: 'text', nullable: true }) damage_status: string;   // Fully/Partially
  @Column({ type: 'text', nullable: true }) components_damaged: string; // pipelines, pump house, chlorinator…

  @Column({ type: 'integer', nullable: true }) minorly_damaged_no: number;
  @Column({ type: 'integer', nullable: true }) partially_damaged_no: number;
  @Column({ type: 'integer', nullable: true }) washed_away_no: number;
  @Column({ type: 'integer', nullable: true }) total_schemes_no: number;

  @Column({ type: 'numeric', precision: 16, scale: 2, nullable: true })
  estimated_cost_million_pkr: number;

  @Column({ type: 'text', nullable: true }) restoration_status: string;

  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'text', nullable: true }) source: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}