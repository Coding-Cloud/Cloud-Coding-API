import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AddProjectVersionDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
