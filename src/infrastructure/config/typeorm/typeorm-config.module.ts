import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: process.env.DATABASE_HOST as string,
    port: process.env.DATABASE_PORT as unknown as number,
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_NAME as string,
    synchronize: false,
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    migrationsRun: true,
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    //autoLoadEntities: true,
    cli: {
      migrationsDir: 'src/infrastructure/config/migrations',
    },
  } as TypeOrmModuleOptions);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeormConfigModule {}
