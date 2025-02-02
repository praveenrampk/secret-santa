import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../schemas/member.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(member: Member): Promise<Member> {
    const createdMember = new this.memberModel(member);
    return createdMember.save();
  }

  async findAll(): Promise<Member[]> {
    return this.memberModel.find().exec();
  }

  async findByMemberID(memberID: string): Promise<Member> {
    return this.memberModel.findById(memberID).exec();
  }

  async findByEmail(email: string): Promise<MemberDocument> {
    const member = await this.memberModel.findOne({ email }).exec();

    if (!member) {
      throw new NotFoundException(`Member with email ${email} not found`);
    }

    return member;
  }

  async update(id: string, member: Member): Promise<Member> {
    return this.memberModel.findByIdAndUpdate(id, member, { new: true });
  }

  async delete(id: string): Promise<Member> {
    return this.memberModel.findOneAndDelete({ _id: id });
  }

  async searchMembers(query: string): Promise<Member[]> {
    if (!query) return [];

    return this.memberModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      })
      .select('name email avatar')
      .exec();
  }
}
