import { Groups } from '../../domain/group/groups.interface';

export class DeleteGroupUseCase {
  constructor(private readonly groups: Groups) {}

  async deleteGroup(id: string): Promise<void> {
    return await this.groups.deleteGroup(id);
  }
}
