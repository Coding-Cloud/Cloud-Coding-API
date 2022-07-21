import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ProjectVisibility } from '../../../../../domain/project/project-visibility.enum';

export class UpdateProjectDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name?: string;

  @IsEnum(ProjectVisibility)
  @ApiProperty()
  globalVisibility?: ProjectVisibility;
}
