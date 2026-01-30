import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name_uz: string;

  @Prop({ required: true, default: '' })
  name_en: string;

  @Prop({ required: true, default: '' })
  name_ru: string;

  @Prop({ required: true })
  address_uz: string;

  @Prop({ required: true, default: '' })
  address_en: string;

  @Prop({ required: true, default: '' })
  address_ru: string;

  @Prop()
  phone?: string;

  @Prop()
  image?: string;

  @Prop({ type: { lat: Number, lng: Number }, required: false })
  coordinates?: { lat: number; lng: number };

  @Prop({ default: true })
  is_active: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

