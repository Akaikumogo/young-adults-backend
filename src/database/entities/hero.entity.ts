import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('heroes')
export class Hero {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @Column({ name: 'content_uz', type: 'text' })
  content_uz: string;

  @Column({ name: 'content_en', type: 'text', default: '' })
  content_en: string;

  @Column({ name: 'content_ru', type: 'text', default: '' })
  content_ru: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: '' })
  image: string;

  @Column({ default: '' })
  video: string;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
