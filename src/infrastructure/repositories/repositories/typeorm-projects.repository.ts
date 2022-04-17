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

export class TypeormProjectsRepository implements Projects {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntityRepository: Repository<ProjectEntity>,
  ) {}

  async createProject(project: Project): Promise<Project> {
    try {
      const createdProject = ProjectAdapter.toProjectEntity(project);
      const creationProject = this.projectEntityRepository.create({
        ...createdProject,
        status: ProjectStatus.INITIALISING,
      });

      const projectEntity = await this.projectEntityRepository.save(
        creationProject,
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

  async updateProjectById(id: string, project: Project): Promise<void> {
    const updatedProject = ProjectAdapter.toProjectEntity(project);
    try {
      await this.projectEntityRepository.update(id, updatedProject);
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
      if (error.code === '23505') {
        throw new ConflictException('Name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findBy(props: { id?: string; name?: string }): Promise<Project> {
    const { id, name } = props;
    try {
      const projectEntity = await this.projectEntityRepository
        .createQueryBuilder()
        .where('id=:id', { id })
        .orWhere('name=:name', { name })
        .getOne();
      return ProjectAdapter.toProject(projectEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }
}
