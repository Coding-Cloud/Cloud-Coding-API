import { Follower } from './follower';

export interface Followers {
  followUser(followerId: string, followedId: string): Promise<void>;

  unfollowUser(followerId: string, followedId: string): Promise<void>;

  findFollowsById(
    followerId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]>;

  findFollowersById(
    followedId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]>;
}
