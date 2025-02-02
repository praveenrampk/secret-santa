import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { CreateWishListDTO } from './dto/wish-list.dto';
import { UpdateWishListDTO } from './dto/update-wish-list.dto';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post('/:groupID/members/:memberID')
  @HttpCode(HttpStatus.CREATED)
  public async addWishList(
    @Param('groupID') groupID: string,
    @Param('memberID') memberID: string,
    @Body() createWishListDTO: CreateWishListDTO,
  ) {
    return this.wishListService.addWishList(
      groupID,
      memberID,
      createWishListDTO,
    );
  }

  @Get('/members/:memberID')
  @HttpCode(HttpStatus.OK)
  public async getAllWishList(@Param('memberID') memberID: string) {
    return this.wishListService.getWishList(memberID);
  }

  @Get('/group/:groupID/members/:memberID')
  @HttpCode(HttpStatus.OK)
  public async getWishList(
    @Param('groupID') groupID: string,
    @Param('memberID') memberID: string,
  ) {
    return this.wishListService.getWishList(memberID);
  }

  @Put('/:wishListID/members/:memberID')
  @HttpCode(HttpStatus.OK)
  public async updateWishList(
    @Param('wishListID') wishListID: string,
    @Param('memberID') memberID: string,
    @Body() updateWishListDTO: UpdateWishListDTO,
  ) {
    return this.wishListService.updateWishList(
      wishListID,
      memberID,
      updateWishListDTO,
    );
  }

  @Delete('/group/:groupID/members/:memberID')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteWishList(
    @Param('wishListID') wishListID: string,
    @Param('groupID') groupID: string,
    @Param('memberID') memberID: string,
  ) {
    return this.wishListService.deleteWishList(wishListID, groupID, memberID);
  }
}
