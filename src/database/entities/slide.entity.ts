import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('slides')
export class Slide {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ name: 'title_uz' })
  title_uz: string;

  @Column({ name: 'title_en', default: '' })
  title_en: string;

  @Column({ name: 'title_ru', default: '' })
  title_ru: string;

  @Column({ name: 'description_uz', type: 'text' })
  description_uz: string;

  @Column({ name: 'description_en', type: 'text', default: '' })
  description_en: string;

  @Column({ name: 'description_ru', type: 'text', default: '' })
  description_ru: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ nullable: true })
  video: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
