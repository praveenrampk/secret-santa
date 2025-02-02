import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, unique: true })
  groupID: string;

  @Prop({ required: true, type: String })
  groupName: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  creatorID: string;

  @Prop({ required: true, type: String })
  welcomeMessage: string;

  @Prop({ enum: ['allotted', 'pending'], default: 'pending' })
  santaAllocationStatus?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
