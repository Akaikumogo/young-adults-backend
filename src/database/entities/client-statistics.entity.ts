import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('client_statistics')
export class ClientStatistics {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
