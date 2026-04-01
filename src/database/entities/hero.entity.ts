import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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
