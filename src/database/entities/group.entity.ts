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
import { Employee } from './employee.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'max_students', type: 'int', default: 30 })
  maxStudents: number;

  @Column({ name: 'days_of_week', type: 'simple-array', nullable: true })
  daysOfWeek: string[] | null;

  @Column({ name: 'start_time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', nullable: true })
  endTime: string | null;

  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee | null;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
