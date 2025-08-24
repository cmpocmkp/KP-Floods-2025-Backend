import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'warehouse_stock_snapshots', schema: 'dmis' })
@Index(['report_date'])
export class WarehouseStockSnapshots {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'integer' })
  total_stock_available: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}