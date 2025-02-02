import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class GetMemberQueryDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email)
  memberID?: string;
}
