import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document & {
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'moderator', 'teacher', 'student'] })
  role: string;

  @Prop()
  avatar_url?: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  last_login?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

