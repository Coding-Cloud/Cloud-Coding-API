import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { UserEditingList } from '../../../domain/user-editing/user-editing-list.interface';
import { UserEditing } from '../../../domain/user-editing/user-editing';
import { CreateUserEditingCandidate } from '../../../usecases/user-editing/candidates/create-user-editing.candidate';
import { UserEditingEntity } from '../entities/user-editing/user-editing.entity';
import UserEditingAdapter from '../entities/user-editing/user-editing-adapter';

export class TypeormUserEditingRepository implements UserEditingList {
  constructor(
    @InjectRepository(UserEditingEntity)
    private readonly userEditingEntityRepository: Repository<UserEditingEntity>,
  ) {}

  async addUserEditing(candidate: CreateUserEditingCandidate): Promise<string> {
    try {
      const createEditing = this.userEditingEntityRepository.create({
        ...candidate,
      });
      const userEditingEntity = await this.userEditingEntityRepository.save(
        createEditing,
      );
      return userEditingEntity.id;
    } catch (e) {
      Logger.error(e);
    }
  }

  async deleteUserEditingByRoom(room: string): Promise<void> {
    await this.userEditingEntityRepository
      .createQueryBuilder()
      .delete()
      .where('room=:room', { room })
      .execute();
  }

  async deleteUserEditingBySocketId(socketId: string): Promise<void> {
    await this.userEditingEntityRepository
      .createQueryBuilder()
      .delete()
      .where('socketId=:socketId', { socketId })
      .execute();
  }

  async findByRoom(room: string): Promise<UserEditing[]> {
    try {
      const userEditingEntities = await this.userEditingEntityRepository
        .createQueryBuilder()
        .where('UserEditingEntity.room=:room', { room })
        .getMany();

      return userEditingEntities.map((entity) =>
        UserEditingAdapter.toUserEditing(entity),
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  async findUserEditingList(): Promise<UserEditing[]> {
    try {
      const userEditingEntities = await this.userEditingEntityRepository.find();
      return userEditingEntities.map((entity) =>
        UserEditingAdapter.toUserEditing(entity),
      );
    } catch (e) {
      Logger.error(e);
    }
  }
}
