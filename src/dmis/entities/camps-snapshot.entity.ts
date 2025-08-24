import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'camps_snapshot', schema: 'dmis' })
@Index(['report_date'])
@Index(['item_title'])
export class CampsSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'integer' })
  total_camps: number;

  @Column({ type: 'integer' })
  key_id: number;

  @Column({ type: 'integer' })
  item_value: number;

  @Column({ type: 'text', name: 'district' })
  item_title: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}