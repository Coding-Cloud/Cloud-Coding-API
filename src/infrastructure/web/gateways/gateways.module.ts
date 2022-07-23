import { Module } from '@nestjs/common';
import { ProjectEditionGateway } from './project-edition/project-edition.gateway';
import { MessagingGateway } from './messaging/messaging.gateway';
import { UseCasesProxyProjectEditionModule } from '../../usecases-proxy/project-edition/use-cases-proxy-project-edition.module';
import { HttpModule } from '@nestjs/axios';
import { UseCasesProxyMessageModule } from '../../usecases-proxy/message/use-cases-proxy-message.module';
import { UsecasesProxyUserModule } from '../../usecases-proxy/user/usecases-proxy-user.module';
import { UseCasesProxySessionModule } from '../../usecases-proxy/session/usecase-proxy-session.module';
import { UseCasesProxyConversationModule } from '../../usecases-proxy/conversation/use-cases-proxy-conversation.module';
import { SocialNetworkGateway } from './social-network/social-network.gateway';
import { UseCasesProxyUserSocketModule } from '../../usecases-proxy/user-socket/usecase-proxy-user-socket.module';
import { UseCasesProxyProjectVersioningModule } from '../../usecases-proxy/project-version/use-cases-proxy-project-version.module';
import { UseCasesProxyUserEditingModule } from '../../usecases-proxy/user-editing/usecase-proxy-user-socket.module';

@Module({
  imports: [
    HttpModule,
    UseCasesProxyUserEditingModule.register(),
    UseCasesProxyProjectEditionModule.register(),
    UseCasesProxyMessageModule.register(),
    UsecasesProxyUserModule.register(),
    UseCasesProxySessionModule.register(),
    UseCasesProxyConversationModule.register(),
    UseCasesProxyUserSocketModule.register(),
    UseCasesProxyProjectVersioningModule.register(),
  ],
  providers: [ProjectEditionGateway, MessagingGateway, SocialNetworkGateway],
})
export class GatewaysModule {}
