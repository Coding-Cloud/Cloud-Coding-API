import { Logger } from '@nestjs/common';
import { Group } from '../../domain/group/group';
import { Groups } from '../../domain/group/groups.interface';

export class UpdateGroupUseCase {
  constructor(private readonly groups: Groups) {}

  async updateGroupById(id: string, group: Group): Promise<void> {
    Logger.log(`Group {${id}} updated with values {${group}}`);
    return this.groups.updateGroupById(id, group);
  }
}
