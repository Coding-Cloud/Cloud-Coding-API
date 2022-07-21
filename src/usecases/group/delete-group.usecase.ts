import { Groups } from '../../domain/group/groups.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class DeleteGroupUseCase {
  constructor(
    private readonly groups: Groups,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async deleteGroup(groupId: string): Promise<void> {
    this.eventEmitter.emit('group.deleted', groupId);
    return await this.groups.deleteGroup(groupId);
  }
}
