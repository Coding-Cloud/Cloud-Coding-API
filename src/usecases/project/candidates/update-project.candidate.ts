import { ProjectVisibility } from '../../../domain/project/project-visibility.enum';
import { ProjectStatus } from '../../../domain/project/project-status.enum';

export class UpdateProjectCandidate {
  name?: string;
  globalVisibility?: ProjectVisibility;
  status?: ProjectStatus;
  groupId?: string;
  lastVersion?: number;
}
