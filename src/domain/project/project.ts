import { ProjectStatus } from './project-status.enum';
import { ProjectLanguage } from './project-language.enum';
import { ProjectVisibility } from './project-visibility.enum';

export class Project {
  id: string;
  name: string;
  uniqueName: string;
  lastVersion: number;
  language: ProjectLanguage;
  status: ProjectStatus;
  globalVisibility: ProjectVisibility;
  creatorId: string;
  groupId: string;
  createdAt: Date;
}
