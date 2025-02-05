import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastVisited?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
