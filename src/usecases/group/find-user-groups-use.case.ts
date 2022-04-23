import { Groups } from '../../domain/group/groups.interface';
import { Group } from '../../domain/group/group';

export class FindUserGroupsUseCase {
  constructor(private readonly groups: Groups) {}

  async findUserGroups(userId: string): Promise<Group[]> {
    return await this.groups.findByUserId(userId);
  }
}
