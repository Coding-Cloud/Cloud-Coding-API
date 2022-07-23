import { UserEditingEntity } from './user-editing.entity';
import { UserEditing } from '../../../../domain/user-editing/user-editing';

export default class UserEditingAdapter {
  static toUserEditing(session: UserEditingEntity): UserEditing {
    const { id, username, socketId, room } = session;
    return {
      id,
      username,
      socketId,
      room,
    };
  }
}
