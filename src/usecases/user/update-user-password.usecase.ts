import { Users } from 'src/domain/user/users.interface';
import { Encrypt } from '../../domain/encrypt.interface';

export class UpdateUserPasswordUseCases {
  constructor(
    private readonly users: Users,
    private readonly encrypt: Encrypt,
  ) {}

  async updateUserPasswordById(
    userId: string,
    password: string,
  ): Promise<void> {
    const salt = await this.encrypt.genSaltkey();
    const hashedPassword = await this.encrypt.hash(password, salt);
    await this.users.changePassword(userId, hashedPassword);
  }
}
