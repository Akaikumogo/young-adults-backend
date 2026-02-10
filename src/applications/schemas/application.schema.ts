import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true })
  full_name: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: string;

  @Prop({ type: String, required: false })
  notes?: string; // Admin/moderator notes

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: false })
  assignedEmployee?: Types.ObjectId; // Employee who will handle this application
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
