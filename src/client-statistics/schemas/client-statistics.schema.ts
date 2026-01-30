import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ClientStatisticsDocument = ClientStatistics & Document;

@Schema({ timestamps: true })
export class ClientStatistics {
  @Prop({ type: String, default: '' })
  icon?: string;

  @Prop({ required: false, default: '' })
  title_uz?: string;

  @Prop({ required: false, default: '' })
  title_en?: string;

  @Prop({ required: false, default: '' })
  title_ru?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: string | number;

  @Prop({ default: true })
  is_active: boolean;
}

export const ClientStatisticsSchema = SchemaFactory.createForClass(ClientStatistics);
