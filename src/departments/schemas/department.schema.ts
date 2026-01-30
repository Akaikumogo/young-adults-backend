import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string; // Will be hashed

  @Prop({ required: true })
  head_name: string; // Department head full name

  @Prop({ default: true })
  is_active: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

