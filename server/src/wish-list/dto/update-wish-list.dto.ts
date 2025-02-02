import { IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class UpdateWishListDTO {
  @IsString()
  @IsOptional()
  text?: string;

  @ValidateIf((o) => o.link?.length > 0)
  @IsOptional()
  @IsUrl()
  link?: string;
}
