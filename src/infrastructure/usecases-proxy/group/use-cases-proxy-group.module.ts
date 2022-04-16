import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { CreateGroupUseCase } from '../../../usecases/group/create-group.usecase';
import { TypeormGroupsRepository } from '../../repositories/repositories/typeorm-groups.repository';
import { UpdateGroupUseCase } from '../../../usecases/group/update-project-use.case';
import { DeleteGroupUseCase } from '../../../usecases/group/delete-project.usecase';
import { GetGroupUseCase } from '../../../usecases/group/get-group.usecase';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyGroupModule {
  static CREATE_GROUP_USE_CASES_PROXY = 'createGroupUseCaseProxy';
  static GET_GROUP_USE_CASES_PROXY = 'getGroupUseCaseProxy';
  static DELETE_GROUP_USE_CASES_PROXY = 'deleteGroupUseCaseProxy';
  static UPDATE_GROUP_USE_CASES_PROXY = 'updateGroupUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyGroupModule,
      providers: [
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new CreateGroupUseCase(groups)),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new GetGroupUseCase(groups)),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new DeleteGroupUseCase(groups)),
        },
        {
          inject: [TypeormGroupsRepository],
          provide: UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
          useFactory: (groups: TypeormGroupsRepository) =>
            new UseCaseProxy(new UpdateGroupUseCase(groups)),
        },
      ],
      exports: [
        UseCasesProxyGroupModule.CREATE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.GET_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.DELETE_GROUP_USE_CASES_PROXY,
        UseCasesProxyGroupModule.UPDATE_GROUP_USE_CASES_PROXY,
      ],
    };
  }
}
