import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('client_statistics')
export class ClientStatistics {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @Column({ default: '' })
  icon: string;

  @Column({ name: 'title_uz', default: '' })
  title_uz: string;

  @Column({ name: 'title_en', default: '' })
  title_en: string;

  @Column({ name: 'title_ru', default: '' })
  title_ru: string;

  @Column({ type: 'jsonb' })
  value: string | number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
