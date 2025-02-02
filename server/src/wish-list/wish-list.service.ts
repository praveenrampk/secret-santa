import { Injectable, NotFoundException } from '@nestjs/common';
import { WishListRepository } from './repositories/wish-list.repository';
import { GroupRepository } from 'src/group/repositories/group.repository';
import { CreateWishListDTO } from './dto/wish-list.dto';
import { GroupMemberRepository } from 'src/group/repositories/group-member.repository';
import { UpdateWishListDTO } from './dto/update-wish-list.dto';
import { WishList } from './schemas/wish-list.schema';

@Injectable()
export class WishListService {
  constructor(
    private readonly wishListRepository: WishListRepository,
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  public async addWishList(
    groupID: string,
    memberID: string,
    createWishListDTO: CreateWishListDTO,
  ) {
    const group = await this.groupRepository.findByGroupID(groupID);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupID} not found.`);
    }

    const member = await this.groupMemberRepository.findByMemberAndGroupID(
      groupID,
      memberID,
    );

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${memberID} not found in group ${groupID}.`,
      );
    }

    const wishListItem = await this.wishListRepository.create({
      groupID,
      memberID,
      ...createWishListDTO,
    });

    return wishListItem;
  }

  public async getWishList(memberID: string) {
    const wishListItem = await this.wishListRepository.findByMemberID(memberID);
    if (!wishListItem) {
      throw new NotFoundException(
        `WishList not found for member ID ${memberID}.`,
      );
    }
    return wishListItem;
  }

  public async updateWishList(
    wishListID: string,
    memberID: string,
    updateWishListDTO: UpdateWishListDTO,
  ) {
    const wishListItem = await this.wishListRepository.findByWishlistIDMemberID(
      wishListID,
      memberID,
    );
    if (!wishListItem) {
      throw new NotFoundException(
        `WishList not found for member ID ${memberID}.`,
      );
    }

    const updatedWishList = await this.wishListRepository.update(
      wishListItem._id.toString(),
      updateWishListDTO as WishList,
    );
    return updatedWishList;
  }

  public async deleteWishList(
    wishListID: string,
    groupID: string,
    memberID: string,
  ) {
    const wishListItem = await this.wishListRepository.findByWishlistIDMemberID(
      wishListID,
      memberID,
    );
    if (!wishListItem) {
      throw new NotFoundException(
        `WishList not found for member ID ${memberID} in group ${groupID}.`,
      );
    }

    await this.wishListRepository.delete(wishListItem._id.toString());
    return {
      message: `WishList for member ID ${memberID} deleted successfully.`,
    };
  }
}
