import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'warehouse_item_requested', schema: 'dmis' })
@Index(['report_date'])
@Index(['item_title'])
export class WarehouseItemRequested {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'integer' })
  total_item_requested: number;

  @Column({ type: 'integer' })
  key_id: number;

  @Column({ type: 'integer' })
  item_value: number;

  @Column({ type: 'text' })
  item_title: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}