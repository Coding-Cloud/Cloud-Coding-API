import { UserEditingList } from '../../domain/user-editing/user-editing-list.interface';

export class DeleteUserEditingUseCases {
  constructor(private userEditingList: UserEditingList) {}

  deleteUserEditingBySocketId(socketId: string): Promise<void> {
    return this.userEditingList.deleteUserEditingBySocketId(socketId);
  }

  deleteUserEditingByRoom(room: string): Promise<void> {
    return this.userEditingList.deleteUserEditingByRoom(room);
  }
}
