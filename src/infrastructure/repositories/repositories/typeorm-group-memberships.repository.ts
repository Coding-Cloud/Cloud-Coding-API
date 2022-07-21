import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMemberships } from '../../../domain/group-membership/group-memberships.interface';
import { GroupMembership } from '../../../domain/group-membership/group-membership';
import GroupMembershipAdapter from '../entities/group-membership/group-membership.adapter';
import { GroupMembershipEntity } from '../entities/group-membership/group-membership.entity';

export class TypeormGroupMembershipsRepository implements GroupMemberships {
  constructor(
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipEntityRepository: Repository<GroupMembershipEntity>,
  ) {}

  async findByGroupId(groupId: string): Promise<GroupMembership[]> {
    try {
      const groupEntities = await this.groupMembershipEntityRepository
        .createQueryBuilder()
        .where('GroupMembershipEntity.groupId=:groupId', { groupId })
        .getMany();
      return groupEntities.map((groupEntity) =>
        GroupMembershipAdapter.toGroupMembership(groupEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findByUserId(userId: string): Promise<GroupMembership[]> {
    try {
      const groupEntities = await this.groupMembershipEntityRepository
        .createQueryBuilder()
        .leftJoin('GroupMembershipEntity.group', 'GroupEntity')
        .where('GroupMembershipEntity.userId=:userId', { userId })
        .andWhere('GroupEntity.isHidden=FALSE')
        .getMany();
      return groupEntities.map((groupEntity) =>
        GroupMembershipAdapter.toGroupMembership(groupEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async joinGroup(userId: string, groupId: string): Promise<void> {
    try {
      const groupMembership = this.groupMembershipEntityRepository.create({
        userId,
        groupId,
        canEdit: true,
      });

      await this.groupMembershipEntityRepository.save(groupMembership);
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    await this.groupMembershipEntityRepository.delete({ userId, groupId });
  }

  async updateGroupMembership(
    userId: string,
    groupId: string,
    canEdit: boolean,
  ): Promise<void> {
    await this.groupMembershipEntityRepository
      .createQueryBuilder()
      .update()
      .set({ canEdit })
      .where('groupId=:groupId', { groupId })
      .andWhere('userId=:userId', { userId })
      .execute();
  }
}
