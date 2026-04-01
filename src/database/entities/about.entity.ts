import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('about')
export class About {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ name: 'title_uz' })
  title_uz: string;

  @Column({ name: 'title_en', default: '' })
  title_en: string;

  @Column({ name: 'title_ru', default: '' })
  title_ru: string;

  @Column({ name: 'main_title_uz', type: 'text' })
  main_title_uz: string;

  @Column({ name: 'main_title_en', type: 'text', default: '' })
  main_title_en: string;

  @Column({ name: 'main_title_ru', type: 'text', default: '' })
  main_title_ru: string;

  @Column({ name: 'description_uz', type: 'text' })
  description_uz: string;

  @Column({ name: 'description_en', type: 'text', default: '' })
  description_en: string;

  @Column({ name: 'description_ru', type: 'text', default: '' })
  description_ru: string;

  @Column({ name: 'content_uz', type: 'text' })
  content_uz: string;

  @Column({ name: 'content_en', type: 'text', default: '' })
  content_en: string;

  @Column({ name: 'content_ru', type: 'text', default: '' })
  content_ru: string;

  @Column({ nullable: true })
  image1: string | null;

  @Column({ nullable: true })
  image2: string | null;

  @Column({ nullable: true })
  image3: string | null;

  @Column({ nullable: true })
  image4: string | null;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
