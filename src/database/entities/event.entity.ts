import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity('events')
export class SiteEvent {
  @PrimaryColumn('uuid')
  _id: string;

  @BeforeInsert()
  private setId() {
    if (!this._id) this._id = randomUUID();
  }

  @Column({ name: 'event_title_uz' })
  eventTitle_uz: string;

  @Column({ name: 'event_title_en', default: '' })
  eventTitle_en: string;

  @Column({ name: 'event_title_ru', default: '' })
  eventTitle_ru: string;

  @Column({ name: 'event_description_uz', type: 'text' })
  eventDescription_uz: string;

  @Column({ name: 'event_description_en', type: 'text', default: '' })
  eventDescription_en: string;

  @Column({ name: 'event_description_ru', type: 'text', default: '' })
  eventDescription_ru: string;

  @Column({ name: 'event_image', nullable: true })
  eventImage: string | null;

  @Column({ name: 'event_video', nullable: true })
  eventVideo: string | null;

  @Column({ name: 'is_active', default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
