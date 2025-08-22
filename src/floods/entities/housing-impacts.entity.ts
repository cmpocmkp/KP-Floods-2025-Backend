import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'housing_impacts', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class HousingImpacts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text' })
  division: string;

  @Column({ type: 'text' })
  district: string;

  @Column({ type: 'text', default: 'Housing' })
  department: string;

  @Column({ type: 'integer', nullable: true })
  houses_destroyed_fully: number;

  @Column({ type: 'integer', nullable: true })
  houses_destroyed_partially: number;

  @Column({ type: 'integer', nullable: true })
  shops_destroyed: number;

  @Column({ type: 'integer', nullable: true })
  petrol_pumps_destroyed: number;

  @Column({ type: 'integer', nullable: true })
  religious_places: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}