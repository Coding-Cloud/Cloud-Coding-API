import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { FindProjectCommentsUseCase } from '../../../usecases/comment/find-project-comments.usecase';
import { TypeormCommentsRepository } from '../../repositories/repositories/typeorm-comments.repository';
import { FindUserPublicCommentsUseCase } from '../../../usecases/comment/find-user-comments.usecase';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyCommentModule {
  static FIND_PROJECT_COMMENTS_USE_CASES_PROXY =
    'findProjectCommentsUseCaseProxy';
  static FIND_USER_PUBLIC_COMMENTS_USE_CASES_PROXY =
    'findUserCommentsUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyCommentModule,
      providers: [
        {
          inject: [TypeormCommentsRepository],
          provide:
            UseCasesProxyCommentModule.FIND_PROJECT_COMMENTS_USE_CASES_PROXY,
          useFactory: (comments: TypeormCommentsRepository) =>
            new UseCaseProxy(new FindProjectCommentsUseCase(comments)),
        },
        {
          inject: [TypeormCommentsRepository],
          provide:
            UseCasesProxyCommentModule.FIND_USER_PUBLIC_COMMENTS_USE_CASES_PROXY,
          useFactory: (comments: TypeormCommentsRepository) =>
            new UseCaseProxy(new FindUserPublicCommentsUseCase(comments)),
        },
      ],
      exports: [
        UseCasesProxyCommentModule.FIND_PROJECT_COMMENTS_USE_CASES_PROXY,
        UseCasesProxyCommentModule.FIND_USER_PUBLIC_COMMENTS_USE_CASES_PROXY,
      ],
    };
  }
}
