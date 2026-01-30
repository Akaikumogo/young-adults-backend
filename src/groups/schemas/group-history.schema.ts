import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupHistoryDocument = GroupHistory & Document;

@Schema({ timestamps: true })
export class GroupHistory {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: false })
  fromGroup?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: false })
  toGroup?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  movedBy?: Types.ObjectId;

  @Prop({ default: Date.now })
  movedAt: Date;

  @Prop()
  reason?: string;
}

export const GroupHistorySchema = SchemaFactory.createForClass(GroupHistory);

