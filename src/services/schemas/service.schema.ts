import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  name_uz: string; // Country name

  @Prop({ required: true, default: '' })
  name_en: string;

  @Prop({ required: true, default: '' })
  name_ru: string;

  @Prop({ required: true })
  flag: string; // Flag image URL

  @Prop({ required: true })
  description_uz: string;

  @Prop({ required: true, default: '' })
  description_en: string;

  @Prop({ required: true, default: '' })
  description_ru: string;

  @Prop({ required: true })
  minIELTS: string;

  @Prop({ default: 0 })
  order: number; // Display order

  @Prop({ default: true })
  is_active: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

