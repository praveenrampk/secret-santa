import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SecretSantaService } from './secret-santa.service';
import { AllocateSantaDto } from './dto/allocate-santa.dto';

@Controller('secret-santa')
export class SecretSantaController {
  constructor(private readonly secretSantaService: SecretSantaService) {}

  @Post('/allocate-santa')
  @HttpCode(HttpStatus.CREATED)
  public async allocateSecretSanta(
    @Body() { creatorID, groupID }: AllocateSantaDto,
  ) {
    const result = await this.secretSantaService.allocateSecretSanta(
      groupID,
      creatorID,
    );

    return {
      message: 'Secret Santa has been allocated successfully!',
      data: result,
    };
  }
}
