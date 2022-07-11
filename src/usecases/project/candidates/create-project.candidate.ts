import { ProjectVisibility } from '../../../domain/project/project-visibility.enum';
import { ProjectStatus } from '../../../domain/project/project-status.enum';
import { ProjectLanguage } from '../../../domain/project/project-language.enum';

export class CreateProjectCandidate {
  name: string;
  uniqueName?: string;
  language: ProjectLanguage;
  creatorId: string;
  groupId: string;
  status: ProjectStatus;
  globalVisibility: ProjectVisibility;
  repositoryUrl?: string;
}
