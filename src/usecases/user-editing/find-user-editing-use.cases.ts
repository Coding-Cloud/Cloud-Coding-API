import { UserEditing } from '../../domain/user-editing/user-editing';
import { UserEditingList } from '../../domain/user-editing/user-editing-list.interface';

export class FindUserEditingUseCases {
  constructor(private userEditingList: UserEditingList) {}

  async findUserEditingList(): Promise<UserEditing[]> {
    return this.userEditingList.findUserEditingList();
  }

  async findByRoom(room: string): Promise<UserEditing[]> {
    return this.userEditingList.findByRoom(room);
  }
}
