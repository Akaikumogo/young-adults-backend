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
  main_title_uz: string; // Markup text (HTML)

  @Prop({ required: true, default: '' })
  main_title_en: string;

  @Prop({ required: true, default: '' })
  main_title_ru: string;

  @Prop({ required: true })
  description_uz: string; // Markup text (HTML)

  @Prop({ required: true, default: '' })
  description_en: string;

  @Prop({ required: true, default: '' })
  description_ru: string;

  @Prop({ required: true })
  content_uz: string; // Rich text yoki markdown

  @Prop({ required: true, default: '' })
  content_en: string;

  @Prop({ required: true, default: '' })
  content_ru: string;

  @Prop({ required: false })
  image1?: string;

  @Prop({ required: false })
  image2?: string;

  @Prop({ required: false })
  image3?: string;

  @Prop({ required: false })
  image4?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const AboutSchema = SchemaFactory.createForClass(About);

