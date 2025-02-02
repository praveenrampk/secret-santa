import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from './repositories/member.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { v4 as uuid } from 'uuid';
import { Member } from './schemas/member.schema';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  public async addMember(createMemberDto: CreateMemberDto) {
    try {
      const newMember = {
        memberID: uuid(),
        ...createMemberDto,
      };

      return await this.memberRepository.create(newMember);
    } catch (error) {
      throw new InternalServerErrorException('Failed to add new member');
    }
  }

  public async getMember(email: string) {
    return await this.memberRepository.findByEmail(email);
  }

  public async getMemberByID(memberID: string) {
    return this.memberRepository.findByMemberID(memberID);
  }

  public async editName(memberID: string, name: string) {
    return await this.memberRepository.update(memberID, { name } as Member);
  }

  public async verifyPassword(
    memberID: string,
    oldPassword: string,
  ): Promise<boolean> {
    const { password } = await this.memberRepository.findByMemberID(memberID);

    return password === oldPassword;
  }

  public async updatePassword(memberID: string, newPassword: string) {
    return this.memberRepository.update(memberID, {
      password: newPassword,
    } as Member);
  }

  public async searchMembers(query: string) {
    return await this.memberRepository.searchMembers(query);
  }
}
