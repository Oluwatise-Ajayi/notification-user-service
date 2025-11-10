import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, length: 500 })
  device_token?: string;

  @Column({ default: true })
  push_enabled: boolean;

  @Column({ default: true })
  email_enabled: boolean;

  @Column({ default: false })
  sms_enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
