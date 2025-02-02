import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SecretSantaRepository } from './repositories/secret-santa.repository';
import { GroupRepository } from 'src/group/repositories/group.repository';
import { GroupMemberRepository } from 'src/group/repositories/group-member.repository';
import { GroupMember } from 'src/group/schemas/group-member.schema';
import { Types } from 'mongoose';
import { SANTA_ALLOCATION_STATUS } from './secret-santa.constants';
import { Group } from 'src/group/schemas/group.schema';

@Injectable()
export class SecretSantaService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly secretSantaRepository: SecretSantaRepository,
  ) {}

  private shuffleList<T>(list: T[]): T[] {
    const shuffledList = [...list];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[randomIndex]] = [
        shuffledList[randomIndex],
        shuffledList[i],
      ];
    }
    return shuffledList;
  }

  public async allocateSecretSanta(groupID: string, creatorID: string) {
    const group = await this.groupRepository.findByGroupID(groupID);

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupID} not found.`);
    }

    if (
      !Types.ObjectId.isValid(creatorID) ||
      !new Types.ObjectId(group.creatorID).equals(creatorID)
    ) {
      throw new ForbiddenException(
        'Only the group creator can allocate Secret Santa.',
      );
    }

    if (group.santaAllocationStatus === SANTA_ALLOCATION_STATUS.ALLOTTED) {
      throw new UnprocessableEntityException(
        'Santa has already been allotted for this group.',
      );
    }

    const groupMembers = await this.groupMemberRepository.findByGroupID(
      group.id,
    );

    if (!groupMembers.length) {
      throw new NotFoundException(`No members found in group ${groupID}.`);
    }

    if (groupMembers.length < 3) {
      throw new UnprocessableEntityException(
        'At least 3 members are required to allocate Secret Santa.',
      );
    }

    const shuffledMembers: GroupMember[] = this.shuffleList(groupMembers);

    const allocations = shuffledMembers.map((_, index) => {
      const giverID = shuffledMembers[index].memberID;
      const receiverID =
        shuffledMembers[(index + 1) % shuffledMembers.length].memberID;

      return {
        groupID,
        giverID,
        receiverID,
        drawnAt: new Date(),
      };
    });

    await Promise.all([
      this.secretSantaRepository.bulkCreate(allocations),
      this.groupRepository.update(group._id.toString(), {
        santaAllocationStatus: SANTA_ALLOCATION_STATUS.ALLOTTED,
      } as Group),
    ]);

    return allocations;
  }
}
