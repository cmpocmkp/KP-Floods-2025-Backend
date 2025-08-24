import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'division_incident_summaries', schema: 'dmis' })
@Index(['report_date'])
@Index(['division_name'])
export class DivisionIncidentSummaries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  report_date: Date;

  @Column({ type: 'text', name: 'division' })
  division_name: string;

  @Column({ type: 'integer' })
  total_deaths: number;

  @Column({ type: 'integer' })
  total_injured: number;

  @Column({ type: 'integer' })
  total_houses_damaged: number;

  @Column({ type: 'integer' })
  cattle_perished: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}