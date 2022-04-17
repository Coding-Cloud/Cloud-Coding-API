import { Follower } from './follower';

export interface Followers {
  followUser(followerId: string, followedId: string): Promise<void>;

  unfollowUser(followerId: string, followedId: string): Promise<void>;

  findFollowsById(followerId: string): Promise<Follower[]>;

  findFollowersById(followedId: string): Promise<Follower[]>;
}
