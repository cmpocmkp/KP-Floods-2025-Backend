import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'human_losses', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class HumanLosses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Relief' })
  department: string;

  @Column({ type: 'integer', nullable: true })
  death: number;

  @Column({ type: 'integer', nullable: true })
  total_injuries: number;

  @Column({ type: 'integer', nullable: true })
  grievous_injuries: number;

  @Column({ type: 'integer', nullable: true })
  substantial_injuries: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}