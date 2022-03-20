import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST as string,
      port: process.env.DATABASE_PORT as unknown as number,
      username: process.env.DATABASE_USER as string,
      password: process.env.DATABASE_PASSWORD as string,
      database: 'nest_task_2',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
