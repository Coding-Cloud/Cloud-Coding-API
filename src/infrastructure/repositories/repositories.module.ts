import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfigModule } from '../config/typeorm/typeorm-config.module';
import { UserEntity } from './entities/user/user.entity';
import { SessionEntity } from './entities/session/session.entity';
import { PasswordResetEntity } from './entities/password-reset/password-reset.entity';
import { ProjectEntity } from './entities/project/project.entity';
import { EncryptModule } from '../encrypt/encrypt.module';
import { TypeormUsersRepository } from './repositories/typeorm-users.repository';
import { TypeormSessionsRespository } from './repositories/typeorm-session.repository';
import { TypeormPasswordResetRespository } from './repositories/typeorm-password-reset.repository';
import { TypeormProjectsRepository } from './repositories/typeorm-projects.repository';
import { TypeormGroupsRepository } from './repositories/typeorm-groups.repository';
import { AssetEntity } from './entities/asset/asset.entity';
import { CodeSnippetEntity } from './entities/code-snippet/code-snippet.entity';
import { FollowerEntity } from './entities/follower/follower.entity';
import { FriendshipEntity } from './entities/friendship/friendship.entity';
import { FriendRequestEntity } from './entities/friend-request/friend-request.entity';
import { GroupEntity } from './entities/group/group.entity';
import { GroupMembershipEntity } from './entities/group-membership/group-membership.entity';
import { PostEntity } from './entities/post/post.entity';
import { ConversationEntity } from './entities/conversation/conversation.entity';
import { CommentEntity } from './entities/comment/comment.entity';
import { TypeormGroupMembershipsRepository } from './repositories/typeorm-group-memberships.repository';
import { TypeormFollowersRepository } from './repositories/typeorm-followers.repository';
import { TypeormFriendRequestsRepository } from './repositories/typeorm-friend-requests.repository';

@Module({
  imports: [
    TypeormConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetEntity,
      ProjectEntity,
      AssetEntity,
      CodeSnippetEntity,
      CommentEntity,
      ConversationEntity,
      FollowerEntity,
      FriendRequestEntity,
      FriendshipEntity,
      GroupEntity,
      GroupMembershipEntity,
      PostEntity,
    ]),
    EncryptModule,
  ],
  providers: [
    TypeormUsersRepository,
    TypeormSessionsRespository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
    TypeormGroupsRepository,
    TypeormGroupMembershipsRepository,
    TypeormFollowersRepository,
    TypeormFriendRequestsRepository,
  ],
  exports: [
    TypeormUsersRepository,
    TypeormSessionsRespository,
    TypeormPasswordResetRespository,
    TypeormProjectsRepository,
    TypeormGroupsRepository,
    TypeormGroupMembershipsRepository,
    TypeormFollowersRepository,
    TypeormFriendRequestsRepository,
  ],
})
export class RepositoriesModule {}
