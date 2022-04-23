import { Group } from './group';
import { CreateGroupCandidate } from '../../usecases/group/candidates/create-group.candidate';
import { UpdateGroupCandidate } from '../../usecases/group/candidates/update-group.candidate';

export interface Groups {
  createGroup(createGroupCandidate: CreateGroupCandidate): Promise<Group>;

  findById(id: string): Promise<Group>;

  findAll(): Promise<Group[]>;

  findByOwnerId(userId: string): Promise<Group[]>;

  updateGroupById(
    id: string,
    updateGroupCandidate: UpdateGroupCandidate,
  ): Promise<void>;

  deleteGroup(id: string): Promise<void>;
}
