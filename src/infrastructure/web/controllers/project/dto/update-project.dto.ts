import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name?: string;

  @IsEmpty()
  lastVersion?: number;
}
