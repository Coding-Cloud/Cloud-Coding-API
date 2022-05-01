import { Module } from '@nestjs/common';
import { UniqueNameGenerators } from './unique-name-generators';
import { NameGenerator } from '../../domain/name-generator.interface';

@Module({
  providers: [{ provide: NameGenerator, useClass: UniqueNameGenerators }],
  exports: [NameGenerator],
})
export class NameGeneratorModule {}
