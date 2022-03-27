import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from './typeorm.config';

export const getTypeOrmModuleOptions = (): TypeOrmModuleOptions =>
  databaseConfig;

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
