import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SlideDocument = Slide & Document;

@Schema({ timestamps: true })
export class Slide {
  @Prop({ required: true })
  title_uz: string;

  @Prop({ required: true, default: '' })
  title_en: string;

  @Prop({ required: true, default: '' })
  title_ru: string;

  @Prop({ required: true })
  description_uz: string;

  @Prop({ required: true, default: '' })
  description_en: string;

  @Prop({ required: true, default: '' })
  description_ru: string;

  @Prop({ required: true })
  image: string; // Image URL

  @Prop({ required: false })
  video?: string; // Optional video URL

  @Prop({ type: Number, default: 0 })
  order: number; // Display order

  @Prop({ default: true })
  is_active: boolean;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
