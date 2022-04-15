import { Group } from './group';

export interface Groups {
  createGroup(userId: string): Promise<void>;

  findById(token: string): Promise<Group>;
}
