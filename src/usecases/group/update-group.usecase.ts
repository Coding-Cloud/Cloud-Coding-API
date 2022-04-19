import { Logger } from '@nestjs/common';
import { Groups } from '../../domain/group/groups.interface';
import { UpdateGroupCandidate } from './candidates/update-group.candidate';

export class UpdateGroupUseCase {
  constructor(private readonly groups: Groups) {}

  async updateGroupById(
    id: string,
    updateGroupCandidate: UpdateGroupCandidate,
  ): Promise<void> {
    Logger.log(`Group {${id}} updated with values {${updateGroupCandidate}}`);
    return this.groups.updateGroupById(id, updateGroupCandidate);
  }
}
