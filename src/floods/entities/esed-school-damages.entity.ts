import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'esed_school_damages', schema: 'floods' })
@Index(['division', 'district'])
@Index(['report_date'])
@Index(['district', 'report_date'], { unique: true })
export class EsedSchoolDamages {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'date' }) report_date: Date;
  @Column({ type: 'text' }) division: string;
  @Column({ type: 'text' }) district: string;

  @Column({ type: 'text', default: 'Education (E&SE)' }) department: string;

  @Column({ type: 'text', nullable: true }) emis_code: string;
  @Column({ type: 'text', nullable: true }) school_name: string;
  @Column({ type: 'text', nullable: true }) school_gender: string; // Male/Female
  @Column({ type: 'text', nullable: true }) school_level: string;  // Primary/Middle/High/Higher Secondary
  @Column({ type: 'text', nullable: true }) tehsil: string;

  @Column({ type: 'text', nullable: true }) nature_of_damage: string;        // free text
  @Column({ type: 'text', nullable: true }) damage_status: string;           // Fully/Partially
  @Column({ type: 'integer', nullable: true }) damaged_rooms: number;

  @Column({ type: 'text', nullable: true }) boundary_wall_status: string;    // Fully/Partially/None
  @Column({ type: 'integer', nullable: true }) toilets_damaged: number;
  @Column({ type: 'boolean', nullable: true }) water_supply_damaged: boolean;
  @Column({ type: 'boolean', nullable: true }) floor_damaged: boolean;
  @Column({ type: 'boolean', nullable: true }) main_gate_damaged: boolean;
  @Column({ type: 'text', nullable: true }) others: string;

  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'text', nullable: true }) source: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}