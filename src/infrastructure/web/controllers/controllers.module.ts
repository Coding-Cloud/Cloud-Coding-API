import { Module } from '@nestjs/common';
import { UsecasesProxyResetPasswordModule } from '../../usecases-proxy/reset-password/usecase-proxy-reset-password.module';
import { UseCasesProxySessionModule } from '../../usecases-proxy/session/usecase-proxy-session.module';
import { UsecasesProxyUserModule } from '../../usecases-proxy/user/usecases-proxy-user.module';
import { AuthController } from './auth/auth.controller';
import { PasswordResetController } from './auth/password-reset.controller';
import { UseCasesProxyProjectModule } from '../../usecases-proxy/project/use-cases-proxy-project.module';
import { ProjectsController } from './project/projects.controller';
import { UseCasesProxyProjectVersioningModule } from '../../usecases-proxy/project-version/use-cases-proxy-project-version.module';
import { ProjectVersionsController } from './project-version/project-versions.controller';
import { UseCasesProxyGroupModule } from '../../usecases-proxy/group/use-cases-proxy-group.module';
import { GroupsController } from './group/groups.controller';
import { GroupMembershipsController } from './group-membership/group-memberships.controller';
import { UseCasesProxyGroupMembershipModule } from '../../usecases-proxy/group-membership/use-cases-proxy-group-membership.module';
import { FollowersController } from './follower/followers.controller';
import { UseCasesProxyFollowerModule } from '../../usecases-proxy/follower/use-cases-proxy-follower.module';
import { FriendRequestsController } from './friend-request/friend-requests.controller';
import { UseCasesProxyFriendRequestModule } from '../../usecases-proxy/friend-request/use-cases-proxy-friend-request.module';
import { UseCasesProxyFriendshipModule } from '../../usecases-proxy/friendship/use-cases-proxy-friendship.module';
import { FriendshipsController } from './friendship/friendships.controller';
import { UseCasesProxyConversationModule } from '../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { ConversationsController } from './conversation/conversations.controller';
import { UseCasesProxyMessageModule } from '../../usecases-proxy/message/use-cases-proxy-message.module';
import { MessagesController } from './message/messages.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [
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
  controllers: [
    AuthController,
    ConversationsController,
    FollowersController,
    FriendRequestsController,
    FriendshipsController,
    GroupsController,
    GroupMembershipsController,
    MessagesController,
    PasswordResetController,
    ProjectsController,
    ProjectVersionsController,
    UserController,
  ],
})
export class ControllersModule {}
