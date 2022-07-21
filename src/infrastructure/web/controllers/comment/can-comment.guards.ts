import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyProjectModule } from '../../../usecases-proxy/project/use-cases-proxy-project.module';
import { FindProjectUseCase } from '../../../../usecases/project/find-project.usecase';
import { ProjectVisibility } from '../../../../domain/project/project-visibility.enum';
import { UsecasesProxyUserModule } from '../../../usecases-proxy/user/usecases-proxy-user.module';
import { IsProjectMemberUseCase } from '../../../../usecases/user/is-project-member.usecase';

@Injectable()
export class CanCommentGuard implements CanActivate {
  constructor(
    @Inject(UseCasesProxyProjectModule.FIND_PROJECT_USE_CASES_PROXY)
    private readonly findProjectUseCase: UseCaseProxy<FindProjectUseCase>,
    @Inject(UsecasesProxyUserModule.IS_PROJECT_MEMBER_USE_CASES_PROXY)
    private readonly isProjectMemberUseCase: UseCaseProxy<IsProjectMemberUseCase>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.body['projectId'];
    const userId = request.user.id;
    const project = await this.findProjectUseCase
      .getInstance()
      .findProjectBy({ id: projectId });
    const isProjectMember = await this.isProjectMemberUseCase
      .getInstance()
      .isProjectMember(userId, projectId);
    return (
      project.globalVisibility === ProjectVisibility.PUBLIC || isProjectMember
    );
  }
}
