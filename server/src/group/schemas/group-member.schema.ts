import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupMemberDocument = HydratedDocument<GroupMember>;

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
  groupID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true })
  memberID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  addedBy: string;

  @Prop({ type: String, enum: ['admin', 'member'], default: 'member' })
  role: string;

  @Prop({ type: String, enum: ['active', 'removed'], default: 'active' })
  status?: string;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
