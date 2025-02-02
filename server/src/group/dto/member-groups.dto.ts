import { IsEmail, IsNotEmpty } from 'class-validator';

export class MemberGroupsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
