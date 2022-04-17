import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendships } from '../../../domain/friendship/friendships.interface';
import { FriendshipEntity } from '../entities/friendship/friendship.entity';
import { Friendship } from '../../../domain/friendship/friendship';
import FriendshipAdapter from '../entities/friendship/friendship.adapter';

export class TypeormFriendshipsRepository implements Friendships {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendshipEntityRepository: Repository<FriendshipEntity>,
  ) {}

  async createFriendship(friendship: Friendship): Promise<string> {
    try {
      const friendshipCreationEntity = this.friendshipEntityRepository.create({
        ...friendship,
      });

      const friendshipEntity = await this.friendshipEntityRepository.save(
        friendshipCreationEntity,
      );
      return friendshipEntity.id;
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByUserId(userId: string): Promise<Friendship[]> {
    try {
      const friendshipEntities = await this.friendshipEntityRepository
        .createQueryBuilder()
        .where('FriendshipEntity.user1Id=:userId', { userId })
        .where('FriendshipEntity.user2Id=:userId', { userId })
        .getMany();
      return friendshipEntities.map((friendshipEntity) =>
        FriendshipAdapter.toFriendship(friendshipEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findById(id: string): Promise<Friendship> {
    return await this.friendshipEntityRepository.findOne(id);
  }

  async removeFriendship(id: string): Promise<void> {
    await this.friendshipEntityRepository.delete(id);
  }
}
