import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../../../domain/comment/comments.interface';
import { CreateCommentCandidate } from '../../../usecases/comment/candidates/create-comment.candidate';
import { CommentEntity } from '../entities/comment/comment.entity';
import CommentAdapter from '../entities/comment/comment.adapter';
import { Comment } from '../../../domain/comment/comment';
import { GroupMembershipEntity } from '../entities/group-membership/group-membership.entity';
import { ProjectEntity } from '../entities/project/project.entity';
import { ProjectVisibility } from '../../../domain/project/project-visibility.enum';
import { GroupEntity } from '../entities/group/group.entity';
import { UpdateCommentCandidate } from '../../../usecases/comment/candidates/update-comment.candidate';

export class TypeormCommentsRepository implements Comments {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentEntityRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    createCommentCandidate: CreateCommentCandidate,
  ): Promise<string> {
    try {
      const commentEntity = this.commentEntityRepository.create({
        ...createCommentCandidate,
      });

      const comment = await this.commentEntityRepository.save(commentEntity);
      return comment.id;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.commentEntityRepository.delete(commentId);
  }

  async findProjectComments(
    projectId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]> {
    try {
      const query = this.commentEntityRepository
        .createQueryBuilder()
        .where('CommentEntity.projectId=:projectId', { projectId });
      if (search) {
        query.andWhere('SIMILARITY(CommentEntity.content, :search) > 0.2', {
          search,
        });
      }
      const [commentEntities, count] = await query
        .limit(limit ?? 25)
        .offset(offset ?? 0)
        .orderBy('CommentEntity.createdAt', 'ASC')
        .getManyAndCount();
      return [
        commentEntities.map((commentEntity) =>
          CommentAdapter.toComment(commentEntity),
        ),
        count,
      ];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findUserPublicComments(
    userId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]> {
    try {
      const query = this.commentEntityRepository
        .createQueryBuilder()
        .leftJoin(
          GroupMembershipEntity,
          'GroupMembershipEntity',
          'GroupMembershipEntity.userId = CommentEntity.ownerId',
        )
        .leftJoin(
          GroupEntity,
          'GroupEntity',
          'GroupEntity.ownerId = CommentEntity.ownerId',
        )
        .leftJoin(
          ProjectEntity,
          'ProjectEntity',
          'ProjectEntity.groupId = GroupMembershipEntity.groupId OR ProjectEntity.groupId = GroupEntity.id',
        )
        .where('CommentEntity.ownerId=:userId', { userId })
        .andWhere('ProjectEntity.globalVisibility=:visibility', {
          visibility: ProjectVisibility.PUBLIC,
        });
      if (search) {
        query.andWhere('SIMILARITY(CommentEntity.content, :search) > 0.2', {
          search,
        });
      }
      const [commentEntities, count] = await query
        .limit(limit ?? 25)
        .offset(offset ?? 0)
        .orderBy('CommentEntity.createdAt', 'ASC')
        .getManyAndCount();
      return [
        commentEntities.map((commentEntity) =>
          CommentAdapter.toComment(commentEntity),
        ),
        count,
      ];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findCommentById(id: string): Promise<Comment> {
    try {
      const commentEntity = await this.commentEntityRepository.findOne(id);
      return CommentAdapter.toComment(commentEntity);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async updateComment(
    commentId: string,
    commentCandidate: UpdateCommentCandidate,
  ): Promise<void> {
    const updatedComment = this.commentEntityRepository.create({
      ...commentCandidate,
    });
    try {
      await this.commentEntityRepository.update(commentId, updatedComment);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
