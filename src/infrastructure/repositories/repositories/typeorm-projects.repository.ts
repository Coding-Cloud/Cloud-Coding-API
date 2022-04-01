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
import { CreateProjectDTO } from '../../web/controllers/project/dto/create-project.dto';
import { ProjectStatusEnum } from '../../../domain/project/project-status.enum';
import { UpdateProjectDTO } from '../../web/controllers/project/dto/update-project.dto';

export class TypeormProjectsRepository implements Projects {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntityRepository: Repository<ProjectEntity>,
  ) {}

  async createProject(createProjectDTO: CreateProjectDTO): Promise<Project> {
    const { name, language } = createProjectDTO;
    const project = this.projectEntityRepository.create({
      name,
      status: ProjectStatusEnum.INITIALISING,
      language,
    });

    try {
      const projectEntity = await this.projectEntityRepository.save(project);
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
    updateProjectDTO: UpdateProjectDTO,
  ): Promise<void> {
    const project = {
      ...(updateProjectDTO.name && { name: updateProjectDTO.name }),
      ...(updateProjectDTO.lastVersion && {
        lastVersion: updateProjectDTO.lastVersion,
      }),
      ...(updateProjectDTO.status && { status: updateProjectDTO.status }),
    };
    try {
      await this.projectEntityRepository.update(id, project);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async initialisedProjectById(id: string): Promise<void> {
    try {
      await this.projectEntityRepository.update(id, {
        status: ProjectStatusEnum.INACTIVE,
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
