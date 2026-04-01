import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('locations')
export class Location {
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

  @Column({ name: 'address_uz', type: 'text' })
  address_uz: string;

  @Column({ name: 'address_en', type: 'text', default: '' })
  address_en: string;

  @Column({ name: 'address_ru', type: 'text', default: '' })
  address_ru: string;

  @Column({ nullable: true })
  phone: string | null;

  @Column({ nullable: true })
  image: string | null;

  @Column({ type: 'jsonb', nullable: true })
  coordinates: { lat: number; lng: number } | null;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
