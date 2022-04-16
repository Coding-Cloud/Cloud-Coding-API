import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groups } from '../../../domain/group/groups.interface';
import { Group } from '../../../domain/group/group';
import GroupAdapter from '../entities/group/group.adapter';
import { GroupEntity } from '../entities/group/group.entity';

export class TypeormGroupsRepository implements Groups {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupEntityRepository: Repository<GroupEntity>,
  ) {}

  async createGroup(group: Group): Promise<Group> {
    try {
      const createdGroup = GroupAdapter.toGroupEntity(group);
      const creationGroup = this.groupEntityRepository.create(createdGroup);

      const groupEntity = await this.groupEntityRepository.save(creationGroup);
      return GroupAdapter.toGroup(groupEntity);
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteGroup(id: string): Promise<void> {
    await this.groupEntityRepository.delete(id);
  }

  async updateGroupById(id: string, group: Group): Promise<void> {
    const updatedGroup = GroupAdapter.toGroupEntity(group);
    try {
      await this.groupEntityRepository.update(id, updatedGroup);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findBy(props: { id?: string; name?: string }): Promise<Group> {
    const { id, name } = props;
    try {
      const groupEntity = await this.groupEntityRepository
        .createQueryBuilder()
        .where('id=:id', { id })
        .orWhere('name=:name', { name })
        .getOne();
      return GroupAdapter.toGroup(groupEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Group[]> {
    try {
      const groupEntities = await this.groupEntityRepository.find();
      return groupEntities.map((groupEntity) =>
        GroupAdapter.toGroup(groupEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findById(id: string): Promise<Group> {
    try {
      const groupEntity = await this.groupEntityRepository.findOne(id);
      return GroupAdapter.toGroup(groupEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findByUserId(userId: string): Promise<Group[]> {
    try {
      const groupEntities = await this.groupEntityRepository
        .createQueryBuilder()
        .where('userId=:userId', { userId })
        .getMany();
      return groupEntities.map((groupEntity) =>
        GroupAdapter.toGroup(groupEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
