import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversations } from '../../../domain/conversation/conversations.interface';
import { Conversation } from 'src/domain/conversation/conversation';
import ConversationAdapter from '../entities/conversation/conversation.adapter';
import { ConversationEntity } from '../entities/conversation/conversation.entity';
import { GroupMembershipEntity } from '../entities/group-membership/group-membership.entity';
import { FriendshipEntity } from '../entities/friendship/friendship.entity';
import { CreateConversationCandidate } from '../../../usecases/conversation/candidates/create-conversation.candidate';
import { GroupEntity } from '../entities/group/group.entity';

export class TypeormConversationsRepository implements Conversations {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationEntityRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    ownership: CreateConversationCandidate,
  ): Promise<string> {
    try {
      const conversationEntity = this.conversationEntityRepository.create({
        ...ownership,
      });

      const conversation = await this.conversationEntityRepository.save(
        conversationEntity,
      );
      return conversation.id;
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findConversationById(id: string): Promise<Conversation> {
    try {
      const conversationEntity =
        await this.conversationEntityRepository.findOne(id);
      return ConversationAdapter.toConversation(conversationEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findUserConversationById(
    userId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Conversation[]> {
    try {
      const conversationEntities = await this.conversationEntityRepository
        .createQueryBuilder()
        .leftJoin(
          GroupMembershipEntity,
          'GroupMembershipEntity',
          'GroupMembershipEntity.groupId = ConversationEntity.groupId',
        )
        .leftJoin(
          FriendshipEntity,
          'FriendshipEntity',
          'FriendshipEntity.id = ConversationEntity.friendshipId',
        )
        .leftJoin(
          GroupEntity,
          'GroupEntity',
          'GroupEntity.id = ConversationEntity.groupId',
        )
        .where('GroupMembershipEntity.userId=:userId', { userId })
        .orWhere('GroupEntity.ownerId=:userId', { userId })
        .orWhere('FriendshipEntity.user1Id=:userId', { userId })
        .orWhere('FriendshipEntity.user2Id=:userId', { userId })
        .limit(limit ?? 25)
        .offset(offset ?? 0)
        .getMany();
      return conversationEntities.map((conversationEntity) =>
        ConversationAdapter.toConversation(conversationEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async removeConversationByFriendshipId(friendshipId: string): Promise<void> {
    try {
      await this.conversationEntityRepository
        .createQueryBuilder()
        .delete()
        .where('friendshipId=:friendshipId', { friendshipId })
        .execute();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async removeConversationByGroupId(groupId: string): Promise<void> {
    try {
      await this.conversationEntityRepository
        .createQueryBuilder()
        .delete()
        .where('groupId=:groupId', { groupId })
        .execute();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
