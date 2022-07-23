import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from '../config/typeorm/typeorm-config.module';
import { UserEntity } from './entities/user/user.entity';
import { SessionEntity } from './entities/session/session.entity';
import { PasswordResetEntity } from './entities/password-reset/password-reset.entity';
import { ProjectEntity } from './entities/project/project.entity';
import { EncryptModule } from '../encrypt/encrypt.module';
import { TypeormUsersRepository } from './repositories/typeorm-users.repository';
import { TypeormSessionsRepository } from './repositories/typeorm-session.repository';
import { TypeormPasswordResetRespository } from './repositories/typeorm-password-reset.repository';
import { TypeormProjectsRepository } from './repositories/typeorm-projects.repository';
import { TypeormGroupsRepository } from './repositories/typeorm-groups.repository';
import { AssetEntity } from './entities/asset/asset.entity';
import { FollowerEntity } from './entities/follower/follower.entity';
import { FriendshipEntity } from './entities/friendship/friendship.entity';
import { FriendRequestEntity } from './entities/friend-request/friend-request.entity';
import { GroupEntity } from './entities/group/group.entity';
import { GroupMembershipEntity } from './entities/group-membership/group-membership.entity';
import { ConversationEntity } from './entities/conversation/conversation.entity';
import { CommentEntity } from './entities/comment/comment.entity';
import { TypeormGroupMembershipsRepository } from './repositories/typeorm-group-memberships.repository';
import { TypeormFollowersRepository } from './repositories/typeorm-followers.repository';
import { TypeormFriendRequestsRepository } from './repositories/typeorm-friend-requests.repository';
import { TypeormFriendshipsRepository } from './repositories/typeorm-friendships.repository';
import { TypeormConversationsRepository } from './repositories/typeorm-conversations.repository';
import { TypeormMessagesRepository } from './repositories/typeorm-messages.repository';
import { MessageEntity } from './entities/message/message.entity';
import { ProjectUserAccessEntity } from './entities/project-user-access/project-user-access.entity';
import { TypeormUserSocketsRepository } from './repositories/typeorm-user-socket.repository';
import { UserSocketEntity } from './entities/user-socket/user-socket.entity';
import { TypeormCommentsRepository } from './repositories/typeorm-comments.repository';
import { TypeormUserEditingRepository } from './repositories/typeorm-user-editing.repository';
import { UserEditingEntity } from './entities/user-editing/user-editing.entity';

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetEntity,
      ProjectEntity,
      AssetEntity,
      CommentEntity,
      ConversationEntity,
      FollowerEntity,
      FriendRequestEntity,
      FriendshipEntity,
      GroupEntity,
      GroupMembershipEntity,
      MessageEntity,
      ProjectUserAccessEntity,
      UserSocketEntity,
      UserEditingEntity,
    ]),
    EncryptModule,
  ],
  providers: [
    TypeormUsersRepository,
    TypeormSessionsRepository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
    TypeormGroupsRepository,
    TypeormGroupMembershipsRepository,
    TypeormFollowersRepository,
    TypeormFriendRequestsRepository,
    TypeormFriendshipsRepository,
    TypeormConversationsRepository,
    TypeormMessagesRepository,
    TypeormCommentsRepository,
    TypeormUserSocketsRepository,
    TypeormUserEditingRepository,
  ],
  exports: [
    TypeormUsersRepository,
    TypeormSessionsRepository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
    TypeormGroupsRepository,
    TypeormGroupMembershipsRepository,
    TypeormFollowersRepository,
    TypeormFriendRequestsRepository,
    TypeormFriendshipsRepository,
    TypeormConversationsRepository,
    TypeormMessagesRepository,
    TypeormCommentsRepository,
    TypeormUserSocketsRepository,
    TypeormUserEditingRepository,
  ],
})
export class RepositoriesModule {}
