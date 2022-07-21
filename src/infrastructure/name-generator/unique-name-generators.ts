import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { NameGenerator } from '../../domain/name-generator.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UniqueNameGenerators implements NameGenerator {
  generateName(): string {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
      style: 'lowerCase',
    });
  }
}
