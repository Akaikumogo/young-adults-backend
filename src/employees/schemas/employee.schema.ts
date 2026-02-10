import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  description1: string;

  @Prop({ required: true })
  image: string; // Image URL

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: false })
  department_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Position', required: false })
  position_id?: Types.ObjectId;

  @Prop({ required: false, unique: true, sparse: true })
  login?: string; // Login username

  @Prop({ required: false })
  password?: string; // Hashed password
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

