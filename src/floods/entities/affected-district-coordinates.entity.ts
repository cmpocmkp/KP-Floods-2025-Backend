import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'affected_district_coordinates', schema: 'floods' })
export class AffectedDistrictCoordinates {
  @PrimaryColumn({ type: 'text' })
  district: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  get latitude_longitude(): string {
    return `${this.latitude.toFixed(6)},${this.longitude.toFixed(6)}`;
  }

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}