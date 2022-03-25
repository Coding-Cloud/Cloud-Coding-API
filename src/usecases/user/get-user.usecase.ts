import { User } from 'src/domain/user/user';
import { Users } from 'src/domain/user/users.interface';

export class getUserUseCases {
  constructor(private readonly users: Users) {}

  async getUserById(userId: string): Promise<User> {
    return this.users.findBy({ id: userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.users.findBy({ email });
  }
}
