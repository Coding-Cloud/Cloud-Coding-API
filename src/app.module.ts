import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/web/controllers/controllers.module';
import { GatewaysModule } from './infrastructure/web/gateways/gateways.module';
import { EventsModule } from './infrastructure/events/events.module';

@Module({
  imports: [ControllersModule, GatewaysModule, EventsModule],
})
export class AppModule {}
