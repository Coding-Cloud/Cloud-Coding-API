import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsecasesProxyUserModule } from '../usecases-proxy/user/usecases-proxy-user.module';
import { UseCasesProxySessionModule } from '../usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyResetPasswordModule } from '../usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { UseCasesProxyProjectModule } from '../usecases-proxy/project/use-cases-proxy-project.module';
import { UseCasesProxyProjectVersioningModule } from '../usecases-proxy/project-version/use-cases-proxy-project-version.module';
import { UseCasesProxyGroupModule } from '../usecases-proxy/group/use-cases-proxy-group.module';
import { UseCasesProxyGroupMembershipModule } from '../usecases-proxy/group-membership/use-cases-proxy-group-membership.module';
import { UseCasesProxyFollowerModule } from '../usecases-proxy/follower/use-cases-proxy-follower.module';
import { UseCasesProxyFriendRequestModule } from '../usecases-proxy/friend-request/use-cases-proxy-friend-request.module';
import { UseCasesProxyFriendshipModule } from '../usecases-proxy/friendship/use-cases-proxy-friendship.module';
import { UseCasesProxyConversationModule } from '../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { UseCasesProxyMessageModule } from '../usecases-proxy/message/use-cases-proxy-message.module';
import { ProjectEventHandlers } from './project/project.event-handlers';
import { ConversationEventHandlers } from './conversation/conversation.event-handlers';
import { GroupEventHandlers } from './group/group.event-handlers';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    UsecasesProxyUserModule.register(),
    UseCasesProxySessionModule.register(),
    UsecasesProxyResetPasswordModule.register(),
    UseCasesProxyProjectModule.register(),
    UseCasesProxyProjectVersioningModule.register(),
    UseCasesProxyGroupModule.register(),
    UseCasesProxyGroupMembershipModule.register(),
    UseCasesProxyFollowerModule.register(),
    UseCasesProxyFriendRequestModule.register(),
    UseCasesProxyFriendshipModule.register(),
    UseCasesProxyConversationModule.register(),
    UseCasesProxyMessageModule.register(),
  ],
  providers: [
    ProjectEventHandlers,
    ConversationEventHandlers,
    GroupEventHandlers,
  ],
})
export class EventsModule {}
