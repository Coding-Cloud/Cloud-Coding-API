import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ProjectStatus } from '../../../../../domain/project/project-status.enum';

export class UpdateProjectDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name?: string;

  @IsEmpty()
  lastVersion?: number;

  @IsEmpty()
  status?: ProjectStatus;
}
