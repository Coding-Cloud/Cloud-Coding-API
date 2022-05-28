import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowerEntity } from '../entities/follower/follower.entity';
import { Followers } from '../../../domain/follower/followers.interface';
import { Follower } from '../../../domain/follower/follower';
import FollowerAdapter from '../entities/follower/follower.adapter';

export class TypeormFollowersRepository implements Followers {
  constructor(
    @InjectRepository(FollowerEntity)
    private readonly followerEntityRepository: Repository<FollowerEntity>,
  ) {}

  async findFollowersById(
    followedId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]> {
    try {
      const followerEntities = await this.followerEntityRepository
        .createQueryBuilder()
        .where('FollowerEntity.followedId=:followedId', { followedId })
        .limit(limit ?? 25)
        .offset(offset ?? 0)
        .getManyAndCount();
      return [
        followerEntities[0].map((followerEntity) =>
          FollowerAdapter.toFollower(followerEntity),
        ),
        followerEntities[1],
      ];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findFollowsById(
    followerId: string,
    limit?: number,
    offset?: number,
  ): Promise<[Follower[], number]> {
    try {
      const followerEntities = await this.followerEntityRepository
        .createQueryBuilder()
        .where('FollowerEntity.followerId=:followerId', { followerId })
        .limit(limit ?? 25)
        .offset(offset ?? 0)
        .getManyAndCount();
      return [
        followerEntities[0].map((followerEntity) =>
          FollowerAdapter.toFollower(followerEntity),
        ),
        followerEntities[1],
      ];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async followUser(followerId: string, followedId: string): Promise<void> {
    try {
      const followerEntity = this.followerEntityRepository.create({
        followerId,
        followedId,
      });

      await this.followerEntityRepository.save(followerEntity);
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    await this.followerEntityRepository.delete({ followerId, followedId });
  }

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    const follower = await this.followerEntityRepository
      .createQueryBuilder()
      .where('FollowerEntity.followerId=:followerId', { followerId })
      .andWhere('FollowerEntity.followedId=:followedId', { followedId })
      .getOne();
    return follower !== null && follower !== undefined;
  }
}
