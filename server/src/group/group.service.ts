import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './repositories/group.repository';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { v4 as uuid } from 'uuid';
import { SecretSantaService } from 'src/secret-santa/secret-santa.service';
import { GROUP_MEMBER_ROLE } from './group.constants';
import { AddNewMemberInGroupDto } from './dto/add-new-member.dto';
import { Types } from 'mongoose';
import { MakeGroupAdminDto } from './dto/make-admin.dto';
import { GroupMember } from './schemas/group-member.schema';
import { RevokeAdminDto } from './dto/revoke-admin.dto';
import { UpdateGroupDescriptionDto } from './dto/update-group-description.dto';
import { Group } from './schemas/group.schema';
import { GroupMemberDto } from './dto/get-group-members.dto';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly memberRepository: MemberRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly secretSantaService: SecretSantaService,
  ) {}

  public async createNewGroup(createGroupDto: CreateGroupDto) {
    const {
      creatorEmail,
      groupName,
      welcomeMessage,
      description = '',
      emails,
    } = createGroupDto;

    const creator = await this.memberRepository.findByEmail(creatorEmail);
    if (!creator) {
      throw new BadRequestException(
        `Creator with email ${creatorEmail} not found`,
      );
    }

    const members = await Promise.all(
      emails.map((email) => this.memberRepository.findByEmail(email)),
    );

    const invalidEmails = members
      .map((member, index) => (member ? null : emails[index]))
      .filter(Boolean);
    if (invalidEmails.length) {
      throw new BadRequestException(
        `Members with emails ${invalidEmails.join(', ')} not found`,
      );
    }

    const groupID = uuid();

    const group = await this.groupRepository.create({
      groupID,
      creatorID: creator.id,
      groupName,
      welcomeMessage,
      description,
    });

    const adminPromise = this.groupMemberRepository.create({
      addedBy: creator.id,
      groupID: group.id,
      memberID: creator.id,
      role: GROUP_MEMBER_ROLE.ADMIN,
    });

    const groupMemberPromises = members.map((member) =>
      this.groupMemberRepository.create({
        addedBy: creator.id,
        groupID: group.id,
        memberID: member.id,
        role: GROUP_MEMBER_ROLE.MEMBER,
      }),
    );

    await Promise.all([adminPromise, ...groupMemberPromises]);

    return group;
  }

  public async addNewMemberInGroup(
    groupID: string,
    addNewMemberInGroupDto: AddNewMemberInGroupDto,
  ) {
    const { adminID, memberEmail } = addNewMemberInGroupDto;

    const member = await this.memberRepository.findByEmail(memberEmail);

    if (!member) {
      throw new NotFoundException(
        'Member not found. Please signup and try again!.',
      );
    }

    const { id } = member;

    const isMemberExistsInGroup =
      await this.groupMemberRepository.findByMemberAndGroupID(groupID, id);

    if (isMemberExistsInGroup) {
      throw new ConflictException(`Member already exists in group: ${groupID}`);
    }

    const adminData = await this.groupMemberRepository.findByMemberAndGroupID(
      groupID,
      adminID,
    );

    if (!adminData || !new Types.ObjectId(adminData.memberID).equals(adminID)) {
      throw new BadRequestException('Invalid admin Id provided.');
    }

    return this.groupMemberRepository.create({
      addedBy: adminID,
      groupID,
      memberID: id,
      role: GROUP_MEMBER_ROLE.MEMBER,
    });
  }

  public async getMemberGroups(email: string) {
    const { id } = await this.memberRepository.findByEmail(email);

    const myGroups = await this.groupMemberRepository.findGroupByMemberID(id);

    const myGroupsInfo = await Promise.all(
      myGroups.map(({ groupID }) => {
        return this.groupRepository.findByGroupID(groupID);
      }),
    );

    return myGroupsInfo;
  }

  public async getGroupMembers(groupID: string) {
    return this.groupMemberRepository.findByGroupID(groupID);
  }

  public async getGroupMember({ groupID, memberID }: GroupMemberDto) {
    return await this.groupMemberRepository.findByMemberAndGroupID(
      groupID,
      memberID,
    );
  }

  private async hasAdminRole(
    groupID: string,
    adminID: string,
  ): Promise<boolean> {
    const adminData = await this.groupMemberRepository.findByMemberAndGroupID(
      groupID,
      adminID,
    );

    return adminData.role === GROUP_MEMBER_ROLE.ADMIN;
  }

  private async checkRolesAndGetMember(
    data: MakeGroupAdminDto | RevokeAdminDto,
  ) {
    const { adminID, groupID, memberID } = data;

    const [admin, member] = await Promise.all([
      this.groupMemberRepository.findByMemberAndGroupID(groupID, adminID),
      this.groupMemberRepository.findByMemberAndGroupID(groupID, memberID),
    ]);

    if (!admin) {
      throw new BadRequestException('Invalid admin ID');
    }
    if (admin.role !== GROUP_MEMBER_ROLE.ADMIN) {
      throw new ForbiddenException("Provided admin ID doesn't have admin role");
    }
    if (!member) {
      throw new BadRequestException('Invalid member ID');
    }

    return member;
  }

  public async grantAdminRole(makeAdminDto: MakeGroupAdminDto) {
    const member = await this.checkRolesAndGetMember(makeAdminDto);

    if (member.role === GROUP_MEMBER_ROLE.ADMIN) {
      throw new ForbiddenException('Member already has admin role');
    }

    const updatedMember = await this.groupMemberRepository.update(
      member._id.toString(),
      {
        role: GROUP_MEMBER_ROLE.ADMIN,
      } as GroupMember,
    );

    return updatedMember;
  }

  public async revokeAdminRole(revokeAdmin: RevokeAdminDto) {
    const member = await this.checkRolesAndGetMember(revokeAdmin);

    if (member.role !== GROUP_MEMBER_ROLE.ADMIN) {
      throw new ForbiddenException('Member not in a admin role.');
    }

    const updatedMember = await this.groupMemberRepository.update(
      member._id.toString(),
      {
        role: GROUP_MEMBER_ROLE.MEMBER,
      } as GroupMember,
    );

    return updatedMember;
  }

  public async getGroup(groupID: string) {
    return await this.groupRepository.findByGroupID(groupID);
  }

  public async updateGroupInfo(
    groupID: string,
    { adminID, description }: UpdateGroupDescriptionDto,
  ) {
    const hasAdminRole = await this.hasAdminRole(groupID, adminID);

    if (!hasAdminRole) {
      throw new UnprocessableEntityException(
        'Only admin can update description.',
      );
    }

    return await this.groupRepository.update(groupID, { description } as Group);
  }
}
