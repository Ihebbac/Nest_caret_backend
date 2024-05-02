import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import mongoose, { Document } from 'mongoose';

export type RGPDDocument = RGPD & Document;

@Schema()
export class RGPD {
  @Prop()
  title: string;
  @Prop()
  desc: string;
}

export const RGPDSchema = SchemaFactory.createForClass(RGPD);
