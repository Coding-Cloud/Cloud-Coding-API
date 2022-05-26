import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MinLength } from 'class-validator';

export class FindProjectByUniqueNameDto {
  @ApiProperty({
    example: 'example-project',
    description: 'unique name of a project',
  })
  @Type(() => String)
  @MinLength(1)
  uniqueName: string;
}
