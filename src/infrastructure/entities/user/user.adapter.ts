import { User } from 'src/domain/user/user';
import { UserEntity } from './user.entity';

export default class UserAdapter {
  static toUser(user: UserEntity): User {
    const { id, username, password } = user;
    return {
      id,
      username,
      password,
    };
  }
}
