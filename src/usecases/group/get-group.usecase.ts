import { Groups } from '../../domain/group/groups.interface';
import { Group } from '../../domain/group/group';

export class GetGroupUseCase {
  constructor(private readonly groups: Groups) {}

  async getGroup(id: string): Promise<Group> {
    return await this.groups.findById(id);
  }
}
