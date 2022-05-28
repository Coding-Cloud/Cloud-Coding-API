import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UseCasesProxyCommentModule } from '../../../usecases-proxy/comment/use-cases-proxy-comment.module';
import { FindCommentUseCase } from '../../../../usecases/comment/find-comment.usecase';

@Injectable()
export class IsCommentOwnerGuard implements CanActivate {
  constructor(
    @Inject(UseCasesProxyCommentModule.FIND_COMMENT_USE_CASES_PROXY)
    private readonly findCommentUseCase: UseCaseProxy<FindCommentUseCase>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params['commentId'];
    const comment = await this.findCommentUseCase
      .getInstance()
      .getById(commentId);
    const userId = request.user.id;

    return comment.ownerId === userId;
  }
}
