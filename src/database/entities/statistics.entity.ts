import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('statistics')
export class Statistics {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @Column({ name: 'label_uz' })
  label_uz: string;

  @Column({ name: 'label_en', default: '' })
  label_en: string;

  @Column({ name: 'label_ru', default: '' })
  label_ru: string;

  @Column({ type: 'float' })
  value: number;

  @Column({ default: '' })
  icon: string;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
