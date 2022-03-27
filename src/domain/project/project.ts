import { ProjectStatusEnum } from './project-status.enum';
import { ProjectLanguageEnum } from './project-language.enum';

export class Project {
  id: string;
  name: string;
  language: ProjectLanguageEnum;
  status: ProjectStatusEnum;
}
