import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from '../../../domain/project/projects.interface';
import { Project } from '../../../domain/project/project';
import ProjectAdapter from '../entities/project/project.adapter';
import { ProjectEntity } from '../entities/project/project.entity';
import { ProjectStatus } from '../../../domain/project/project-status.enum';
import { CreateProjectCandidate } from '../../../usecases/project/candidates/create-project.candidate';
import { UpdateProjectCandidate } from '../../../usecases/project/candidates/update-project.candidate';

export class TypeormProjectsRepository implements Projects {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntityRepository: Repository<ProjectEntity>,
  ) {}

  async createProject(
    projectCandidate: CreateProjectCandidate,
  ): Promise<string> {
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
      return projectEntity.id;
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

  async initialisedProjectById(id: string): Promise<void> {
    try {
      await this.projectEntityRepository.update(id, {
        status: ProjectStatus.INACTIVE,
      });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async findBy(props: {
    id?: string;
    userId?: string;
    name?: string;
  }): Promise<Project> {
    const { id, userId, name } = props;
    try {
      const projectEntity = await this.projectEntityRepository
        .createQueryBuilder()
        .where('ProjectEntity.id=:id', { id })
        .orWhere('ProjectEntity.name=:name', { name })
        .orWhere('ProjectEntity.creatorId=:userId', { userId })
        .getOne();
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
      .andWhere('SIMILARITY(ProjectEntity.name, :projectName) > 0.1', {
        projectName,
      })
      .getMany();
  }
}
