import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  GroupMember,
  GroupMemberDocument,
} from '../schemas/group-member.schema';

@Injectable()
export class GroupMemberRepository {
  constructor(
    @InjectModel(GroupMember.name)
    private readonly groupMemberModel: Model<GroupMemberDocument>,
  ) {}

  async create(GroupMember: GroupMember): Promise<GroupMember> {
    const createdGroupMember = new this.groupMemberModel(GroupMember);
    return createdGroupMember.save();
  }

  async findAll(): Promise<GroupMember[]> {
    return this.groupMemberModel.find().exec();
  }

  async findByGroupID(groupID: string): Promise<GroupMember[]> {
    return this.groupMemberModel.find({ groupID }).populate('memberID').exec();
  }

  async findGroupByMemberID(memberID: string): Promise<GroupMember[]> {
    return this.groupMemberModel.find({ memberID });
  }

  async findByMemberAndGroupID(
    groupID: string,
    memberID: string,
  ): Promise<GroupMemberDocument> {
    return this.groupMemberModel
      .findOne({ groupID, memberID })
      .populate({
        path: 'memberID',
        select: 'name email avatar',
      })
      .populate({
        path: 'addedBy',
        select: 'name',
      })
      .exec();
  }

  async update(id: string, groupMember: GroupMember): Promise<GroupMember> {
    return this.groupMemberModel.findByIdAndUpdate(id, groupMember, {
      new: true,
    });
  }

  async delete(id: string): Promise<GroupMember> {
    return this.groupMemberModel.findOneAndDelete({ _id: id });
  }
}
