import { Module } from '@nestjs/common';
import { SecretSantaService } from './secret-santa.service';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { SecretSantaRepository } from './repositories/secret-santa.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SecretSanta, SecretSantaSchema } from './schemas/secret-santa.schema';
import { Member, MemberSchema } from 'src/member/schemas/member.schema';
import { GroupRepository } from 'src/group/repositories/group.repository';
import { GroupMemberRepository } from 'src/group/repositories/group-member.repository';
import { Group, GroupSchema } from 'src/group/schemas/group.schema';
import {
  GroupMember,
  GroupMemberSchema,
} from 'src/group/schemas/group-member.schema';
import { SecretSantaController } from './secret-santa.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Group.name, schema: GroupSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
      { name: SecretSanta.name, schema: SecretSantaSchema },
    ]),
  ],
  controllers: [SecretSantaController],
  providers: [
    SecretSantaService,
    SecretSantaRepository,
    MemberRepository,
    GroupRepository,
    GroupMemberRepository,
  ],
})
export class SecretSantaModule {}
