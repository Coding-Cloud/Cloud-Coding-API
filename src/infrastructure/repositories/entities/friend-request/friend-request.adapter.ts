import { FriendRequest } from '../../../../domain/friend-request/friend-request';
import { FriendRequestEntity } from './friend-request.entity';

export default class FriendRequestAdapter {
  static toFriendRequest(friendRequest: FriendRequestEntity): FriendRequest {
    const { requestedUserId, requesterUserId, createdAt } = friendRequest;
    return {
      requestedUserId,
      requesterUserId,
      createdAt,
    };
  }

  static toFriendRequestEntity(
    friendRequest: FriendRequest,
  ): FriendRequestEntity {
    return {
      ...friendRequest,
    };
  }
}
