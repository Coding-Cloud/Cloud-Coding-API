import { Users } from 'src/domain/user/users.interface';
import { UpdateUserCandidate } from './candidates/update-user.candidate';

export class UpdateUserUseCases {
  constructor(private readonly users: Users) {}

  async updateUserById(
    userId: string,
    updateUserCandidate: UpdateUserCandidate,
  ): Promise<void> {
    await this.users.updateUser(userId, updateUserCandidate);
  }
}
