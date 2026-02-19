import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroDocument = Hero & Document;

@Schema({ timestamps: true })
export class Hero {
  @Prop({ required: true })
  content_uz: string;

  @Prop({ required: false, default: '' })
  content_en: string;

  @Prop({ required: false, default: '' })
  content_ru: string;

  @Prop({ required: true, default: 0 })
  priority: number;

  @Prop({ type: String, default: '' })
  image?: string;

  @Prop({ type: String, default: '' })
  video?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);

