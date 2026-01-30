import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name_uz: string;

  @Prop({ required: true, default: '' })
  name_en: string;

  @Prop({ required: true, default: '' })
  name_ru: string;

  @Prop({ required: true })
  description_uz: string;

  @Prop({ required: true, default: '' })
  description_en: string;

  @Prop({ required: true, default: '' })
  description_ru: string;

  @Prop({ required: true })
  duration_uz: string; // "2 soat", "6 oy"

  @Prop({ required: true, default: '' })
  duration_en: string;

  @Prop({ required: true, default: '' })
  duration_ru: string;

  @Prop({ type: Number, required: false })
  daysPerWeek?: number; // Haftada necha kun dars

  @Prop({ type: Number, required: false })
  hoursPerDay?: number; // Bir kunda necha soat dars

  @Prop()
  icon?: string; // Lucide icon nomi (masalan, "GraduationCap")

  @Prop()
  image?: string; // icon yoki image URL

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Teacher' }], default: [] })
  teachers: Types.ObjectId[];

  @Prop({ default: true })
  is_active: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

