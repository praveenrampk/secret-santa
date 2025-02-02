import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddNewMemberInGroupDto {
  @IsString()
  @IsNotEmpty()
  adminID: string;

  @IsEmail()
  @IsNotEmpty()
  memberEmail: string;
}
