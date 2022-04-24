import { ProjectVisibility } from '../../../domain/project/project-visibility.enum';

export class UpdateProjectCandidate {
  name?: string;
  globalVisibility?: ProjectVisibility;
  groupId?: string;
}
