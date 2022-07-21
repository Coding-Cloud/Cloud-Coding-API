import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSocketEntity } from '../entities/user-socket/user-socket.entity';
import { CreateUserSocketCandidate } from '../../../usecases/user-socket/candidates/create-user-socket.candidate';
import { UserSocket } from '../../../domain/user-socket/user-socket';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';
import UserSocketAdapter from '../entities/user-socket/user-socket-adapter';
import { UserSockets } from '../../../domain/user-socket/user-sockets.interface';
import { GroupMembershipEntity } from '../entities/group-membership/group-membership.entity';
import { ConversationEntity } from '../entities/conversation/conversation.entity';
import { FriendshipEntity } from '../entities/friendship/friendship.entity';
import { GroupEntity } from '../entities/group/group.entity';

export class TypeormUserSocketsRepository implements UserSockets {
  private readonly instanceId: string;

  constructor(
    @InjectRepository(UserSocketEntity)
    private readonly userSocketEntityRepository: Repository<UserSocketEntity>,
  ) {
    this.instanceId = uuidv4();
  }

  async addUserSocket(candidate: CreateUserSocketCandidate): Promise<string> {
    try {
      const createSocket = this.userSocketEntityRepository.create({
        ...candidate,
        instanceId: this.instanceId,
      });
      const socket = await this.userSocketEntityRepository.save(createSocket);
      return socket.id;
    } catch (e) {
      Logger.error(e);
    }
  }

  async deleteUserSocket(socketId: string): Promise<void> {
    await this.userSocketEntityRepository
      .createQueryBuilder()
      .delete()
      .where('socketId=:socketId', { socketId })
      .execute();
  }

  async findByUserId(userId: string, instance = true): Promise<UserSocket> {
    try {
      const query = this.userSocketEntityRepository
        .createQueryBuilder()
        .where('UserSocketEntity.userId:=userId', { userId });
      if (instance) {
        query.andWhere('UserSocketEntity.instanceId=:instanceId', {
          instance,
        });
      }
      const userSocketEntity = await query.getOne();
      return UserSocketAdapter.toUserSocket(userSocketEntity);
    } catch (e) {
      Logger.error(e);
    }
  }

  async findUserSockets(instance = true): Promise<UserSocket[]> {
    try {
      const query = this.userSocketEntityRepository.createQueryBuilder();
      if (instance) {
        query.where('UserSocketEntity.instanceId=:instanceId', {
          instanceId: this.instanceId,
        });
      }
      const userSocketEntities = await query.getMany();
      return userSocketEntities.map((userSocketEntity) =>
        UserSocketAdapter.toUserSocket(userSocketEntity),
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  async findConversationUserSockets(
    conversationId: string,
    instance = true,
  ): Promise<UserSocket[]> {
    try {
      const query = this.userSocketEntityRepository
        .createQueryBuilder()
        .leftJoin(
          GroupEntity,
          'GroupEntity',
          'GroupEntity.ownerId = UserSocketEntity.userId',
        )
        .leftJoin(
          GroupMembershipEntity,
          'GroupMembershipEntity',
          'GroupMembershipEntity.userId = UserSocketEntity.userId',
        )
        .leftJoin(
          FriendshipEntity,
          'FriendshipEntity',
          'FriendshipEntity.user1Id = UserSocketEntity.userId OR FriendshipEntity.user2Id = UserSocketEntity.userId',
        )
        .leftJoin(
          ConversationEntity,
          'ConversationEntity',
          'ConversationEntity.groupId = GroupEntity.id OR ' +
            'ConversationEntity.groupId = GroupMembershipEntity.groupId OR ' +
            'ConversationEntity.friendshipId = FriendshipEntity.id',
        )
        .where('ConversationEntity.id=:conversationId', { conversationId });
      if (instance) {
        query.andWhere('UserSocketEntity.instanceId=:instanceId', {
          instanceId: this.instanceId,
        });
      }
      const userSocketEntities = await query.getMany();
      return userSocketEntities.map((userSocketEntity) =>
        UserSocketAdapter.toUserSocket(userSocketEntity),
      );
    } catch (e) {
      Logger.error(e);
    }
  }
}
