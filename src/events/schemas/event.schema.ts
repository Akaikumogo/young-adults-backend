import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventTitle_uz: string;

  @Prop({ required: true, default: '' })
  eventTitle_en: string;

  @Prop({ required: true, default: '' })
  eventTitle_ru: string;

  @Prop({ required: true })
  eventDescription_uz: string;

  @Prop({ required: true, default: '' })
  eventDescription_en: string;

  @Prop({ required: true, default: '' })
  eventDescription_ru: string;

  @Prop({ required: true })
  eventImage: string;

  @Prop({ required: false })
  eventVideo?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
