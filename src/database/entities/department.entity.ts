import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('departments')
export class Department {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

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
