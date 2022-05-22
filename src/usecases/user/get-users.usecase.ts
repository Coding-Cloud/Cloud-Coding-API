import { User } from 'src/domain/user/user';
import { Users } from 'src/domain/user/users.interface';

export class GetUsersUseCases {
  constructor(private readonly users: Users) {}

  async getUsers(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[User[], number]> {
    return this.users.getUsers(search, limit, offset);
  }
}
