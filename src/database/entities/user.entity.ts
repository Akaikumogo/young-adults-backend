import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatar_url: string | null;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'is_public', default: true })
  is_public: boolean;

  @Column({ name: 'last_login', type: 'timestamptz', nullable: true })
  last_login: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
