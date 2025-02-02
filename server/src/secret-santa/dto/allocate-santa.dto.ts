import { IsNotEmpty, IsString } from 'class-validator';

export class AllocateSantaDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;

  @IsString()
  @IsNotEmpty()
  creatorID: string;
}
