import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { MemberGroupsDto } from './dto/member-groups.dto';
import { GroupMemberDto, GroupMembersDto } from './dto/get-group-members.dto';
import { AddNewMemberInGroupDto } from './dto/add-new-member.dto';
import { MakeGroupAdminDto } from './dto/make-admin.dto';
import { RevokeAdminDto } from './dto/revoke-admin.dto';
import { UpdateGroupDescriptionDto } from './dto/update-group-description.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createNewGroup(@Body() createGroupDto: CreateGroupDto) {
    const group = await this.groupService.createNewGroup(createGroupDto);

    return {
      message: 'Group created successfully',
      data: group,
    };
  }

  @Post('/:groupID/members')
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param('groupID') groupID: string,
    @Body() addNewMemberInGroupDto: AddNewMemberInGroupDto,
  ) {
    const member = await this.groupService.addNewMemberInGroup(
      groupID,
      addNewMemberInGroupDto,
    );

    return {
      message: 'Member added to the group successfully',
      data: member,
    };
  }

  @Get('/member/:email')
  @HttpCode(HttpStatus.OK)
  async getMemberGroups(@Param() { email }: MemberGroupsDto) {
    return this.groupService.getMemberGroups(email);
  }

  @Get('/:groupID')
  @HttpCode(HttpStatus.OK)
  async getGroup(@Param('groupID') groupID: string) {
    return this.groupService.getGroup(groupID);
  }

  @Patch('/:groupID/description')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateGroupInfo(
    @Param('groupID') groupID: string,
    @Body() updateGroupDescriptionDto: UpdateGroupDescriptionDto,
  ) {
    return this.groupService.updateGroupInfo(
      groupID,
      updateGroupDescriptionDto,
    );
  }

  @Get('/:groupID/members')
  @HttpCode(HttpStatus.OK)
  async getGroupMembers(@Param() { groupID }: GroupMembersDto) {
    return this.groupService.getGroupMembers(groupID);
  }

  @Get('/:groupID/member/:memberID')
  @HttpCode(HttpStatus.OK)
  async getGroupMember(@Param() data: GroupMemberDto) {
    return this.groupService.getGroupMember(data);
  }

  @Patch('/members/admin')
  @HttpCode(HttpStatus.ACCEPTED)
  async grantAdminRole(@Body() makeAdminDto: MakeGroupAdminDto) {
    const member = await this.groupService.grantAdminRole(makeAdminDto);

    return {
      message: 'Member promoted to admin role',
      data: member,
    };
  }

  @Patch('/members/revoke-admin')
  @HttpCode(HttpStatus.ACCEPTED)
  async revokeAdminRole(@Body() revokeAdminDto: RevokeAdminDto) {
    const member = await this.groupService.revokeAdminRole(revokeAdminDto);

    return {
      message: 'Admin role revoked from the member',
      data: member,
    };
  }
}
