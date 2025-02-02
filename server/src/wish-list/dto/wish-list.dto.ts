import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateWishListDTO {
  @IsString()
  text: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
