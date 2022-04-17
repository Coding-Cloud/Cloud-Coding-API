import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequests } from '../../../domain/friend-request/friend-requests.interface';
import { FriendRequestEntity } from '../entities/friend-request/friend-request.entity';
import { FriendRequest } from '../../../domain/friend-request/friend-request';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import FriendRequestAdapter from '../entities/friend-request/friend-request.adapter';

export class TypeormFriendRequestsRepository implements FriendRequests {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestEntityRepository: Repository<FriendRequestEntity>,
  ) {}

  async createFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<FriendRequest> {
    try {
      const friendRequest = this.friendRequestEntityRepository.create({
        requesterUserId,
        requestedUserId,
      });

      return await this.friendRequestEntityRepository.save(friendRequest);
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteFriendRequest(
    requesterUserId: string,
    requestedUserId: string,
  ): Promise<void> {
    await this.friendRequestEntityRepository.delete({
      requesterUserId,
      requestedUserId,
    });
  }

  async findReceivedFriendRequests(
    requestedUserId: string,
  ): Promise<FriendRequest[]> {
    try {
      const friendRequestEntities = await this.friendRequestEntityRepository
        .createQueryBuilder()
        .where('FriendRequestEntity.requestedUserId=:requestedUserId', {
          requestedUserId,
        })
        .getMany();
      return friendRequestEntities.map((friendRequestEntity) =>
        FriendRequestAdapter.toFriendRequest(friendRequestEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findSentFriendRequests(
    requesterUserId: string,
  ): Promise<FriendRequest[]> {
    try {
      const friendRequestEntities = await this.friendRequestEntityRepository
        .createQueryBuilder()
        .where('FriendRequestEntity.requesterUserId=:requesterUserId', {
          requesterUserId,
        })
        .getMany();
      return friendRequestEntities.map((friendRequestEntity) =>
        FriendRequestAdapter.toFriendRequest(friendRequestEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
