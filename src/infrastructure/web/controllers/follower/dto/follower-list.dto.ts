import { Follower } from '../../../../../domain/follower/follower';

export class FollowerListDto {
  followers: Follower[];
  totalResults: number;
}
