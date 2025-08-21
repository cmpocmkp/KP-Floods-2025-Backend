import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 10, nullable: true, default: null })
  country_code: string;

  @Column({ length: 15, nullable: true, default: null })
  phone_no: string;

  @Column({ length: 100, nullable: true, default: null })
  password: string;

  @Column({ default: false })
  is_google: boolean;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', nullable: true, default: null })
  created_by: number;

  @Column({ type: 'int', nullable: true, default: null })
  updated_by: number;

  @Column({ default: true })
  is_disabled: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: false })
  email_verified: boolean;

  // New fields added
  @Column({ length: 100, nullable: true, default: null })
  city: string;

  @Column({ length: 100, nullable: true, default: null })
  state: string;

  @Column({ length: 100, nullable: true, default: null })
  country: string;

  @Column({ type: 'date', nullable: true, default: null })
  dob: Date;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true,
    default: null,
  })
  gender: string;
}
