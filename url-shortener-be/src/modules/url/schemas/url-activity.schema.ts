import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Url } from './url.schema';

export type UrlActivityDocument = HydratedDocument<UrlActivity>;

@Schema({ timestamps: true })
export class UrlActivity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Url', required: true })
  url: Url;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: Date, default: Date.now })
  accessedAt: Date;
}

export const UrlActivitySchema = SchemaFactory.createForClass(UrlActivity);
