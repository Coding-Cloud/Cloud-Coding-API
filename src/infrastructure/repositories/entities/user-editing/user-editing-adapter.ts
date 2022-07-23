import { UserEditingEntity } from './user-editing.entity';
import { UserEditing } from '../../../../domain/user-editing/user-editing';

export default class UserEditingAdapter {
  static toUserEditing(session: UserEditingEntity): UserEditing {
    const { id, userId, socketId, room } = session;
    return {
      id,
      userId,
      socketId,
      room,
    };
  }
}
