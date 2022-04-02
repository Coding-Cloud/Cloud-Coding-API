import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddProjectVersionDTO {
  @IsEmpty()
  version: number;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
