import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

@Schema({ timestamps: true })
export class About {
  @Prop({ required: true })
  title_uz: string;

  @Prop({ required: true, default: '' })
  title_en: string;

  @Prop({ required: true, default: '' })
  title_ru: string;

  @Prop({ required: true })
  content_uz: string; // Rich text yoki markdown

  @Prop({ required: true, default: '' })
  content_en: string;

  @Prop({ required: true, default: '' })
  content_ru: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ default: true })
  is_active: boolean;
}

export const AboutSchema = SchemaFactory.createForClass(About);

