import { ProjectStatusEnum } from './project-status.enum';
import { ProjectLanguageEnum } from './project-language.enum';

export class Project {
  id: string;
  name: string;
  lastVersion: number;
  language: ProjectLanguageEnum;
  status: ProjectStatusEnum;
}
