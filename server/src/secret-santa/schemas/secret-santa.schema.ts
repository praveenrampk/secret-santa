import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SecretSantaDocument = HydratedDocument<SecretSanta>;

@Schema({ timestamps: true })
export class SecretSanta {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
  groupID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  giverID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  receiverID: string;

  @Prop({ type: String, enum: ['pending', 'completed'], default: 'pending' })
  status?: string;

  @Prop({ type: Date })
  drawnAt: Date;
}

export const SecretSantaSchema = SchemaFactory.createForClass(SecretSanta);
