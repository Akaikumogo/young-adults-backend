import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  full_name: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: false })
  group?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: false })
  teacher?: Types.ObjectId;

  @Prop({ default: Date.now })
  enrollment_date: Date;

  @Prop({ enum: ['active', 'completed', 'dropped'], default: 'active' })
  status: string;

  @Prop({ type: Object, default: {} })
  grades?: { [key: string]: number };

  @Prop({ type: [{ date: Date, present: Boolean }], default: [] })
  attendance?: { date: Date; present: boolean }[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);

