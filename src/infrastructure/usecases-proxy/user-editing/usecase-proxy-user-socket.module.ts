import { DynamicModule, Module } from '@nestjs/common';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { UseCaseProxy } from '../usecases-proxy';
import { AddUserEditingUseCases } from '../../../usecases/user-editing/add-user-editing-use.cases';
import { DeleteUserEditingUseCases } from '../../../usecases/user-editing/delete-user-editing-use.cases';
import { FindUserEditingUseCases } from '../../../usecases/user-editing/find-user-editing-use.cases';
import { TypeormUserEditingRepository } from '../../repositories/repositories/typeorm-user-editing.repository';

@Module({
  imports: [RepositoriesModule],
})
export class UseCasesProxyUserEditingModule {
  static ADD_USER_EDITING_USE_CASES_PROXY = 'addUserEditingUseCasesProxy';
  static DELETE_USER_EDITING_USE_CASES_PROXY = 'deleteUserEditingUseCasesProxy';
  static FIND_USER_EDITING_USE_CASES_PROXY = 'findUserEditingUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyUserEditingModule,
      providers: [
        {
          inject: [TypeormUserEditingRepository],
          provide:
            UseCasesProxyUserEditingModule.ADD_USER_EDITING_USE_CASES_PROXY,
          useFactory: (userEditingList: TypeormUserEditingRepository) =>
            new UseCaseProxy(new AddUserEditingUseCases(userEditingList)),
        },
        {
          inject: [TypeormUserEditingRepository],
          provide:
            UseCasesProxyUserEditingModule.DELETE_USER_EDITING_USE_CASES_PROXY,
          useFactory: (userEditingList: TypeormUserEditingRepository) =>
            new UseCaseProxy(new DeleteUserEditingUseCases(userEditingList)),
        },
        {
          inject: [TypeormUserEditingRepository],
          provide:
            UseCasesProxyUserEditingModule.FIND_USER_EDITING_USE_CASES_PROXY,
          useFactory: (userEditingList: TypeormUserEditingRepository) =>
            new UseCaseProxy(new FindUserEditingUseCases(userEditingList)),
        },
      ],
      exports: [
        UseCasesProxyUserEditingModule.ADD_USER_EDITING_USE_CASES_PROXY,
        UseCasesProxyUserEditingModule.DELETE_USER_EDITING_USE_CASES_PROXY,
        UseCasesProxyUserEditingModule.FIND_USER_EDITING_USE_CASES_PROXY,
      ],
    };
  }
}
