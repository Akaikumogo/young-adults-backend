import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { Position } from './position.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ type: 'text' })
  description1: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @Column({ name: 'is_public', default: true })
  is_public: boolean;

  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @ManyToOne(() => Position, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'position_id' })
  position: Position | null;

  @Column({ unique: true, nullable: true })
  login: string | null;

  @Column({ nullable: true })
  password: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
