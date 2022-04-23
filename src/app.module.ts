import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/web/controllers/controllers.module';
import { GatewaysModule } from './infrastructure/web/gateways/gateways.module';

@Module({
  imports: [ControllersModule, GatewaysModule],
})
export class AppModule {}
