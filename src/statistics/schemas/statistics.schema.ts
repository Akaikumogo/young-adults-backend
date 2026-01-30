import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticsDocument = Statistics & Document;

@Schema({ timestamps: true })
export class Statistics {
  @Prop({ required: true })
  label_uz: string;

  @Prop({ required: true, default: '' })
  label_en: string;

  @Prop({ required: true, default: '' })
  label_ru: string;

  @Prop({ required: true })
  value: number;

  @Prop({ type: String, default: '' })
  icon?: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  is_active: boolean;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);

