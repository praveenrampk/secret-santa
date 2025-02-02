import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Group, GroupDocument } from '../schemas/group.schema';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {}

  async create(Group: Group): Promise<GroupDocument> {
    const createdGroup = new this.groupModel(Group);
    return createdGroup.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findByGroupID(groupID: string): Promise<GroupDocument> {
    return this.groupModel.findById(groupID).populate('creatorID').exec();
  }

  async update(id: string, Group: Group): Promise<Group> {
    return this.groupModel.findByIdAndUpdate(id, Group, {
      new: true,
    });
  }

  async delete(id: string): Promise<Group> {
    return this.groupModel.findOneAndDelete({ _id: id });
  }
}
