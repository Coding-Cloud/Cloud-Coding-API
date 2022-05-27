import { Module } from '@nestjs/common';
import { ProjectEditionGateway } from './project-edition/project-edition.gateway';
import { MessagingGateway } from './messaging/messaging.gateway';
import { UseCasesProxyProjectEditionModule } from '../../usecases-proxy/project-edition/use-cases-proxy-project-edition.module';
import { HttpModule } from '@nestjs/axios';
import { UseCasesProxyMessageModule } from '../../usecases-proxy/message/use-cases-proxy-message.module';
import { UsecasesProxyUserModule } from '../../usecases-proxy/user/usecases-proxy-user.module';
import { UseCasesProxySessionModule } from '../../usecases-proxy/session/usecase-proxy-session.module';
import { UseCasesProxyConversationModule } from '../../usecases-proxy/conversation/use-cases-proxy-conversation.module';

@Module({
  imports: [
    HttpModule,
    UseCasesProxyProjectEditionModule.register(),
    UseCasesProxyMessageModule.register(),
    UsecasesProxyUserModule.register(),
    UseCasesProxySessionModule.register(),
    UseCasesProxyConversationModule.register(),
  ],
  providers: [ProjectEditionGateway, MessagingGateway],
})
export class GatewaysModule {}
