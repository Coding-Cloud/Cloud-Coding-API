import { AccessType } from './access-type.enum';

export class ProjectUserAccess {
  id: string;
  userId: string;
  projectId: string;
  accessType: AccessType;
}
