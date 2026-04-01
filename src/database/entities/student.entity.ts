import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Group } from './group.entity';
import { Employee } from './employee.entity';

export type AttendanceEntry = { date: string; present: boolean };

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ name: 'full_name' })
  full_name: string;

  @Column({ nullable: true })
  email: string | null;

  @Column()
  phone: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Group, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'group_id' })
  group: Group | null;

  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;

  @Column({ name: 'enrollment_date', type: 'timestamptz', default: () => 'NOW()' })
  enrollment_date: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  grades: Record<string, number> | null;

  @Column({ type: 'jsonb', nullable: true })
  attendance: AttendanceEntry[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
