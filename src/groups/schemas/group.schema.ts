import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: Number, default: 30 })
  maxStudents?: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  students: Types.ObjectId[];

  @Prop({ type: [{ type: String }], default: [] })
  daysOfWeek?: string[];

  @Prop({ type: String })
  startTime?: string;

  @Prop({ type: String })
  endTime?: string;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: false })
  teacher?: Types.ObjectId;

  @Prop({ default: true })
  is_active: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

