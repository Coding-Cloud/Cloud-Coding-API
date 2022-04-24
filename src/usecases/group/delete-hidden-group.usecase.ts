import { Groups } from '../../domain/group/groups.interface';
import { UseCaseProxy } from '../../infrastructure/usecases-proxy/usecases-proxy';
import { DeleteGroupUseCase } from './delete-group.usecase';

export class DeleteHiddenGroupUseCase {
  constructor(
    private readonly groups: Groups,
    private readonly deleteGroup: UseCaseProxy<DeleteGroupUseCase>,
  ) {}

  async deleteHiddenGroup(id: string): Promise<void> {
    const group = await this.groups.findById(id);
    if (group.isHidden) {
      await this.deleteGroup.getInstance().deleteGroup(id);
    }
  }
}
