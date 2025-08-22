import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'livestock_losses', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class LivestockLosses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Livestock' })
  department: string;

  @Column({ type: 'integer', nullable: true })
  cattles_perished: number;

  @Column({ type: 'integer', nullable: true })
  big_cattles: number;

  @Column({ type: 'integer', nullable: true })
  small_cattles: number;

  @Column({ type: 'integer', nullable: true })
  other: number;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  fodder_roughages_ton: number;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  fodder_concentrates_kg: number;

  @Column({ type: 'integer', nullable: true })
  shelters_damaged: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}