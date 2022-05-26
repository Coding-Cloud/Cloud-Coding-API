import { Users } from '../../domain/user/users.interface';

export class IsProjectMemberUseCase {
  constructor(private users: Users) {}

  public async isProjectMember(userId: string, projectId: string) {
    return this.users.isProjectMember(userId, projectId);
  }
}
