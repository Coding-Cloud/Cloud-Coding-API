import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../../../../domain/user/user';
import { UseCaseProxy } from '../../../usecases-proxy/usecases-proxy';
import { AuthGuard } from '../auth/auth.guards';
import { UseCasesProxyFriendRequestModule } from '../../../usecases-proxy/friend-request/use-cases-proxy-friend-request.module';
import { AcceptFriendRequestUseCase } from '../../../../usecases/friend-request/accept-friend-request.usecase';
import { RejectFriendRequestUseCase } from '../../../../usecases/friend-request/reject-friend-request.usecase';
import { SendFriendRequestUseCase } from '../../../../usecases/friend-request/send-friend-request.usecase';
import { CancelFriendRequestUseCase } from '../../../../usecases/friend-request/cancel-friend-request.usecase';
import { FindSentFriendRequestsUseCase } from '../../../../usecases/friend-request/find-sent-friend-requests.usecase';
import { FindReceivedFriendRequestsUseCase } from '../../../../usecases/friend-request/find-received-friend-requests.usecase';
import { FriendRequest } from '../../../../domain/friend-request/friend-request';
import { FindFriendRequestUseCase } from '../../../../usecases/friend-request/find-friend-request-use.case';

@Controller('friend-requests')
@ApiTags('friend-requests')
@UseGuards(AuthGuard)
export class FriendRequestsController {
  constructor(
    @Inject(
      UseCasesProxyFriendRequestModule.ACCEPT_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly acceptFriendRequest: UseCaseProxy<AcceptFriendRequestUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.REJECT_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly rejectFriendRequest: UseCaseProxy<RejectFriendRequestUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.SEND_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly sendFriendRequest: UseCaseProxy<SendFriendRequestUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.CANCEL_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly cancelFriendRequest: UseCaseProxy<CancelFriendRequestUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.FIND_SENT_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly findSentFriendRequests: UseCaseProxy<FindSentFriendRequestsUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.FIND_RECEIVED_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly findReceivedFriendRequests: UseCaseProxy<FindReceivedFriendRequestsUseCase>,
    @Inject(
      UseCasesProxyFriendRequestModule.FIND_FRIEND_REQUEST_USE_CASES_PROXY,
    )
    private readonly findFriendRequest: UseCaseProxy<FindFriendRequestUseCase>,
  ) {}

  @Post('/send/:userId')
  sendRequest(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.sendFriendRequest
      .getInstance()
      .sendFriendRequest(user.id, userId);
  }

  @Post('/accept/:userId')
  accept(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.acceptFriendRequest
      .getInstance()
      .acceptFriendRequest(userId, user.id);
  }

  @Delete('/cancel/:userId')
  cancel(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.cancelFriendRequest
      .getInstance()
      .cancelFriendRequest(user.id, userId);
  }

  @Delete('/reject/:userId')
  reject(
    @Param('userId') userId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.rejectFriendRequest
      .getInstance()
      .rejectFriendRequest(userId, user.id);
  }

  @Get('/received')
  findReceived(@GetUser() user: User): Promise<FriendRequest[]> {
    return this.findReceivedFriendRequests
      .getInstance()
      .findReceivedFriendRequests(user.id);
  }

  @Get('/sent')
  findSent(@GetUser() user: User): Promise<FriendRequest[]> {
    return this.findSentFriendRequests
      .getInstance()
      .findSentFriendRequests(user.id);
  }

  @Get('/:userId')
  getFriendRequest(
    @GetUser() user: User,
    @Param('userId') userId: string,
  ): Promise<FriendRequest> {
    return this.findFriendRequest
      .getInstance()
      .findFriendRequests(user.id, userId);
  }
}
