import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendships } from '../../../domain/friendship/friendships.interface';
import { FriendshipEntity } from '../entities/friendship/friendship.entity';
import { Friendship } from '../../../domain/friendship/friendship';
import FriendshipAdapter from '../entities/friendship/friendship.adapter';
import { CreateFriendshipCandidate } from '../../../usecases/friendship/candidates/create-friendship.candidate';

export class TypeormFriendshipsRepository implements Friendships {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendshipEntityRepository: Repository<FriendshipEntity>,
  ) {}

  async createFriendship(
    friendshipCandidate: CreateFriendshipCandidate,
  ): Promise<string> {
    try {
      const friendshipCreationEntity = this.friendshipEntityRepository.create({
        ...friendshipCandidate,
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
        .orWhere('FriendshipEntity.user2Id=:userId', { userId })
        .getMany();
      return friendshipEntities.map((friendshipEntity) =>
        FriendshipAdapter.toFriendship(friendshipEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findByUsers(user1Id: string, user2Id: string): Promise<Friendship> {
    try {
      const friendshipEntity = await this.friendshipEntityRepository
        .createQueryBuilder()
        .where(
          'FriendshipEntity.user1Id=:user1Id AND FriendshipEntity.user2Id=:user2Id',
          { user1Id, user2Id },
        )
        .orWhere(
          'FriendshipEntity.user1Id=:user2Id AND FriendshipEntity.user2Id=:user1Id',
          { user2Id, user1Id },
        )
        .getOneOrFail();
      return FriendshipAdapter.toFriendship(friendshipEntity);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException();
    }
  }

  async findById(id: string): Promise<Friendship> {
    return await this.friendshipEntityRepository.findOne(id);
  }

  async removeFriendship(id: string): Promise<void> {
    await this.friendshipEntityRepository.delete(id);
  }
}
