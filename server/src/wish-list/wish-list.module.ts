import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { WishListController } from './wish-list.controller';
import { WishListRepository } from './repositories/wish-list.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/group/schemas/group.schema';
import {
  GroupMember,
  GroupMemberSchema,
} from 'src/group/schemas/group-member.schema';
import { WishList, WishListSchema } from './schemas/wish-list.schema';
import { GroupRepository } from 'src/group/repositories/group.repository';
import { GroupMemberRepository } from 'src/group/repositories/group-member.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: WishList.name, schema: WishListSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
  ],
  controllers: [WishListController],
  providers: [
    WishListService,
    WishListRepository,
    GroupRepository,
    GroupMemberRepository,
  ],
})
export class WishListModule {}
