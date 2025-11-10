import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export interface UserPreferences {
  email: boolean;
  push: boolean;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ nullable: true, length: 500 })
  push_token?: string;

  @Column({
    type: 'jsonb',
    default: { email: true, push: true },
  })
  preferences: UserPreferences;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
