import { FollowerEntity } from './follower.entity';
import { Follower } from '../../../../domain/follower/follower';

export default class FollowerAdapter {
  static toFollower(follower: FollowerEntity): Follower {
    const { followerId, followedId, createdAt } = follower;
    return {
      followerId,
      followedId,
      createdAt,
    };
  }

  static toFollowerEntity(follower: Follower): FollowerEntity {
    return {
      ...follower,
    };
  }
}
