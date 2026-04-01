import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Department } from './department.entity';
import { randomUUID } from 'crypto';

@Entity('vacations')
@Index(['employee', 'year', 'month'], { unique: true })
export class Vacation {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ name: 'has_vacation', default: false })
  has_vacation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
