import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRepository } from './repositories/group.repository';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupMember, GroupMemberSchema } from './schemas/group-member.schema';
import { Member, MemberSchema } from 'src/member/schemas/member.schema';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { SecretSantaService } from 'src/secret-santa/secret-santa.service';
import { SecretSantaRepository } from 'src/secret-santa/repositories/secret-santa.repository';
import {
  SecretSanta,
  SecretSantaSchema,
} from 'src/secret-santa/schemas/secret-santa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Group.name, schema: GroupSchema },
      { name: SecretSanta.name, schema: SecretSantaSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    GroupRepository,
    GroupMemberRepository,
    SecretSantaRepository,
    MemberRepository,
    SecretSantaService,
  ],
})
export class GroupModule {}
