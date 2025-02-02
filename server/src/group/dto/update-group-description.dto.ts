import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGroupDescriptionDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  adminID: string;
}
