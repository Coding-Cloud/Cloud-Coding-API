import { Group } from './group';

export interface Groups {
  createGroup(group: Group): Promise<Group>;

  findById(id: string): Promise<Group>;

  findAll(): Promise<Group[]>;

  findByUserId(userId: string): Promise<Group[]>;

  updateGroupById(id: string, group: Group): Promise<void>;

  deleteGroup(id: string): Promise<void>;
}
