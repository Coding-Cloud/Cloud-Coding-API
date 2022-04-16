import { Group } from '../../domain/group/group';
import { Groups } from '../../domain/group/groups.interface';

export class CreateGroupUseCase {
  constructor(private readonly groups: Groups) {}

  async createGroup(group: Group): Promise<Group> {
    return await this.groups.createGroup(group);
  }
}
