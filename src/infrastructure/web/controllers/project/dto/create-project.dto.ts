import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProjectLanguage } from '../../../../../domain/project/project-language.enum';
import { ProjectVisibility } from '../../../../../domain/project/project-visibility.enum';

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

  @IsEnum(ProjectVisibility)
  @IsNotEmpty()
  @ApiProperty()
  globalVisibility: ProjectVisibility;

  @IsUUID()
  @ApiProperty()
  groupId?: string;
}
