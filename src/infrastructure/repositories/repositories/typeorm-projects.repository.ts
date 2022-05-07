import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Projects } from '../../../domain/project/projects.interface';
import { Project } from '../../../domain/project/project';
import ProjectAdapter from '../entities/project/project.adapter';
import { ProjectEntity } from '../entities/project/project.entity';
import { ProjectStatus } from '../../../domain/project/project-status.enum';
import { CreateProjectCandidate } from '../../../usecases/project/candidates/create-project.candidate';
import { UpdateProjectCandidate } from '../../../usecases/project/candidates/update-project.candidate';
import { GroupMembershipEntity } from '../entities/group-membership/group-membership.entity';
import { ProjectVisibility } from '../../../domain/project/project-visibility.enum';
import { ProjectUserAccessEntity } from '../entities/project-user-access/project-user-access.entity';
import { GroupEntity } from '../entities/group/group.entity';

export class TypeormProjectsRepository implements Projects {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntityRepository: Repository<ProjectEntity>,
  ) {}

  async createProject(
    projectCandidate: CreateProjectCandidate,
  ): Promise<Project> {
    try {
      const creationProject = this.projectEntityRepository.create({
        ...projectCandidate,
        status: ProjectStatus.INITIALISING,
      });
      const creationProjectEntity =
        ProjectAdapter.toProjectEntity(creationProject);

      const projectEntity = await this.projectEntityRepository.save(
        creationProjectEntity,
      );
      return ProjectAdapter.toProject(projectEntity);
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectEntityRepository.delete(id);
  }

  async updateProjectById(
    id: string,
    projectCandidate: UpdateProjectCandidate,
  ): Promise<void> {
    const updatedProject = this.projectEntityRepository.create({
      ...projectCandidate,
    });
    const updatedProjectEntity = ProjectAdapter.toProjectEntity(updatedProject);
    try {
      await this.projectEntityRepository.update(id, updatedProjectEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async initialisedProject(uniqueName: string): Promise<void> {
    try {
      await this.projectEntityRepository
        .createQueryBuilder()
        .update()
        .set({
          status: ProjectStatus.INACTIVE,
        })
        .where('uniqueName=:uniqueName', { uniqueName })
        .execute();
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findBy(props: {
    id?: string;
    userId?: string;
    uniqueName?: string;
    name?: string;
  }): Promise<Project> {
    const { id, userId, uniqueName, name } = props;
    try {
      const projectEntity = await this.projectEntityRepository
        .createQueryBuilder()
        .where('ProjectEntity.id=:id', { id })
        .orWhere('ProjectEntity.name=:name', { name })
        .orWhere('ProjectEntity.uniqueName=:uniqueName', { uniqueName })
        .orWhere('ProjectEntity.creatorId=:userId', { userId })
        .getOneOrFail();

      return ProjectAdapter.toProject(projectEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findByCreatorId(creatorId: string): Promise<Project[]> {
    try {
      const projectEntities = await this.projectEntityRepository
        .createQueryBuilder()
        .where('ProjectEntity.creatorId=:creatorId', { creatorId })
        .getMany();
      return projectEntities.map((projectEntity) =>
        ProjectAdapter.toProject(projectEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findByGroupId(groupId: string): Promise<Project[]> {
    try {
      const projectEntities = await this.projectEntityRepository
        .createQueryBuilder()
        .where('ProjectEntity.groupId=:groupId', { groupId })
        .getMany();
      return projectEntities.map((projectEntity) =>
        ProjectAdapter.toProject(projectEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  searchUserProjectsByName(
    userId: string,
    projectName: string,
  ): Promise<Project[]> {
    return this.projectEntityRepository
      .createQueryBuilder()
      .where('ProjectEntity.creatorId=:userId', { userId })
      .andWhere('SIMILARITY(ProjectEntity.name, :projectName) > 0.2', {
        projectName,
      })
      .getMany();
  }

  async findVisibleProjects(memberId: string): Promise<Project[]> {
    try {
      const projectEntities = await this.projectEntityRepository
        .createQueryBuilder()
        .leftJoin(
          GroupEntity,
          'GroupEntity',
          'GroupEntity.id = ProjectEntity.groupId',
        )
        .leftJoin(
          GroupMembershipEntity,
          'GroupMembershipEntity',
          'GroupMembershipEntity.groupId = ProjectEntity.groupId',
        )
        .leftJoin(
          ProjectUserAccessEntity,
          'ProjectUserAccessEntity',
          'ProjectUserAccessEntity.projectId = ProjectEntity.id',
        )
        .where(
          new Brackets((qb) => {
            qb.where('ProjectEntity.creatorId=:memberId', { memberId })
              .orWhere('GroupMembershipEntity.userId=:memberId', { memberId })
              .orWhere('GroupEntity.ownerId=:memberId', { memberId });
          }),
        )
        .andWhere('ProjectEntity.globalVisibility != :visibility', {
          visibility: ProjectVisibility.PRIVATE,
        })
        .getMany();
      return projectEntities.map((projectEntity) =>
        ProjectAdapter.toProject(projectEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
