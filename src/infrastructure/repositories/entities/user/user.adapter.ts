import { User } from 'src/domain/user/user';
import { UserEntity } from './user.entity';

export default class UserAdapter {
  static toUser(user: UserEntity): User {
    const { id, username, firstname, lastname, birthdate, email, password } =
      user;
    return {
      id,
      username,
      firstname,
      lastname,
      birthdate,
      email,
      password,
    };
  }

  static toUserEntity(user: User): UserEntity {
    return {
      ...user,
      passwordResets: [],
    };
  }
}
