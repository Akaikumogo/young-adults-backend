import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { randomUUID } from 'crypto';

@Entity('courses')
export class Course {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @Column({ name: 'name_uz' })
  name_uz: string;

  @Column({ name: 'name_en', default: '' })
  name_en: string;

  @Column({ name: 'name_ru', default: '' })
  name_ru: string;

  @Column({ name: 'description_uz', type: 'text' })
  description_uz: string;

  @Column({ name: 'description_en', type: 'text', default: '' })
  description_en: string;

  @Column({ name: 'description_ru', type: 'text', default: '' })
  description_ru: string;

  @Column({ name: 'duration_uz' })
  duration_uz: string;

  @Column({ name: 'duration_en', default: '' })
  duration_en: string;

  @Column({ name: 'duration_ru', default: '' })
  duration_ru: string;

  @Column({ name: 'days_per_week', type: 'int', nullable: true })
  daysPerWeek: number | null;

  @Column({ name: 'hours_per_day', type: 'int', nullable: true })
  hoursPerDay: number | null;

  @Column({ nullable: true })
  icon: string | null;

  @Column({ nullable: true })
  image: string | null;

  @ManyToMany(() => Employee, { eager: false })
  @JoinTable({
    name: 'course_employees',
    joinColumn: { name: 'course_id', referencedColumnName: '_id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: '_id' },
  })
  employees: Employee[];

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
