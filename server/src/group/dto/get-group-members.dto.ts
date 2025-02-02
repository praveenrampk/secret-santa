import { IsNotEmpty, IsString } from 'class-validator';

export class GroupMembersDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;
}

export class GroupMemberDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;

  @IsString()
  @IsNotEmpty()
  memberID: string;
}
