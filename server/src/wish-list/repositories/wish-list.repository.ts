import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { WishList, WishListDocument } from '../schemas/wish-list.schema';

@Injectable()
export class WishListRepository {
  constructor(
    @InjectModel(WishList.name)
    private readonly wishListModel: Model<WishListDocument>,
  ) {}

  async create(wishList: WishList): Promise<WishList> {
    const createdWishList = new this.wishListModel(wishList);
    return createdWishList.save();
  }

  async findAll(): Promise<WishList[]> {
    return this.wishListModel.find().exec();
  }

  async findByWishListID(wishListID: string): Promise<WishList> {
    return this.wishListModel.findById(wishListID).exec();
  }

  async findByMemberID(memberID: string) {
    return this.wishListModel.find({ memberID }).populate('groupID').exec();
  }

  async findByWishlistIDMemberID(id: string, memberID: string) {
    return this.wishListModel
      .findOne({ _id: id, memberID })
      .populate('groupID')
      .exec();
  }

  async update(id: string, wishList: WishList): Promise<WishList> {
    return this.wishListModel
      .findByIdAndUpdate(id, wishList, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    return this.wishListModel.findByIdAndDelete(id).exec();
  }
}
