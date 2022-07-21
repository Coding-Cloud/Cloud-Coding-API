import { Group } from '../../domain/group/group';
import { Groups } from '../../domain/group/groups.interface';
import { CreateGroupCandidate } from './candidates/create-group.candidate';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class CreateGroupUseCase {
  constructor(
    private readonly groups: Groups,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createGroup(
    createGroupCandidate: CreateGroupCandidate,
  ): Promise<Group> {
    const group = await this.groups.createGroup(createGroupCandidate);
    this.eventEmitter.emit('group.created', group.id);
    return group;
  }
}
