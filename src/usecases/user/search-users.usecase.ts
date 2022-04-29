import { User } from 'src/domain/user/user';
import { Users } from 'src/domain/user/users.interface';

export class SearchUsersUseCases {
  constructor(private readonly users: Users) {}

  async searchUsers(search: string): Promise<User[]> {
    return this.users.searchUsers(search);
  }
}
