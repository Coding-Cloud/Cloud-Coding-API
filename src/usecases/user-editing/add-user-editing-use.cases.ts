import { CreateUserEditingCandidate } from './candidates/create-user-editing.candidate';
import { UserEditingList } from '../../domain/user-editing/user-editing-list.interface';

export class AddUserEditingUseCases {
  constructor(private userEditingList: UserEditingList) {}

  addUserEditing(userEditing: CreateUserEditingCandidate): Promise<string> {
    return this.userEditingList.addUserEditing(userEditing);
  }
}
