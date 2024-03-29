import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UseCasesProxySessionModule } from 'src/infrastructure/usecases-proxy/session/usecase-proxy-session.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyUserModule } from 'src/infrastructure/usecases-proxy/user/usecases-proxy-user.module';
import { GetSessionUseCases } from 'src/usecases/session/get-session.usecase';
import { GetUserUseCases } from 'src/usecases/user/get-user.usecase';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(UsecasesProxyUserModule.GET_USER_USE_CASES_PROXY)
    private readonly getUserUseCaseProxy: UseCaseProxy<GetUserUseCases>,
    @Inject(UseCasesProxySessionModule.GET_SESSION_USE_CASES_PROXY)
    private readonly getSessionUseCaseProxy: UseCaseProxy<GetSessionUseCases>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];
    if (bearerToken !== undefined) {
      const token = bearerToken.replace('Bearer ', '');
      const session = await this.getSessionUseCaseProxy
        .getInstance()
        .getSessionByToken(token);
      if (session !== null) {
        request.user = await this.getUserUseCaseProxy
          .getInstance()
          .getUserById(session.userId);
        return true;
      }
    }
    return false;
  }
}
