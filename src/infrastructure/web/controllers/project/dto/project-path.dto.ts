import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MinLength } from 'class-validator';

export class ProjectPathDto {
  @ApiProperty({
    example: 'http://url.com/pomme',
    description: 'path url of a project',
  })
  @Type(() => String)
  @MinLength(5)
  path: string;
}
