import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VacationDocument = Vacation & Document;

@Schema({ timestamps: true })
export class Vacation {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employee_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department_id: Types.ObjectId;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, min: 0, max: 11 }) // 0 = January, 11 = December
  month: number;

  @Prop({ default: false })
  has_vacation: boolean; // True if employee has vacation in this month
}

export const VacationSchema = SchemaFactory.createForClass(Vacation);

// Create compound index for unique employee/year/month combination
VacationSchema.index({ employee_id: 1, year: 1, month: 1 }, { unique: true });

