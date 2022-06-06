import { FriendRequest } from './friend-request';

export interface FriendRequests {
  deleteFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void>;

  createFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<FriendRequest>;

  findFriendRequests(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<FriendRequest>;

  findSentFriendRequests(requesterUserId: string): Promise<FriendRequest[]>;

  findReceivedFriendRequests(requestedUserId: string): Promise<FriendRequest[]>;
}
