import { Groups } from '../../domain/group/groups.interface';
import { Group } from '../../domain/group/group';

export class FindOwnedGroupsUseCase {
  constructor(private readonly groups: Groups) {}

  async findOwnedGroups(userId: string): Promise<Group[]> {
    return await this.groups.findByUserId(userId);
  }
}
