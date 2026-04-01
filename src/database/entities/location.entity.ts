import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
