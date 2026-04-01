import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ name: 'head_name' })
  head_name: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
