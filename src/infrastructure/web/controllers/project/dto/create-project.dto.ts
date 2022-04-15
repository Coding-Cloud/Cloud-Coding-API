import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProjectLanguage } from '../../../../../domain/project/project-language.enum';

export class CreateProjectDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name: string;

  @IsEnum(ProjectLanguage)
  @IsNotEmpty()
  @ApiProperty()
  language: ProjectLanguage;
}
