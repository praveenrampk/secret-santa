import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WishListDocument = HydratedDocument<WishList>;

@Schema({ timestamps: true })
export class WishList {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  memberID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
  groupID: string;

  @Prop({ type: String })
  text: string;

  @Prop({ type: String })
  link?: string;
}

export const WishListSchema = SchemaFactory.createForClass(WishList);
