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

  @Column({ length: 50, unique: true })
  user_id: string;

  @Column({ length: 255 })
  user_name: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  jurisdiction: string;

  @Column({
    type: 'enum',
    enum: ['super_admin', 'admin', 'admin_staff'],
  })
  role: string;

  @Column({ default: false })
  is_disabled: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: false })
  first_login: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255, nullable: true })
  initial_password: string;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', default: 4 })
  data_id: number;
}
