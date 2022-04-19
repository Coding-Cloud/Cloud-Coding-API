import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGroupDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name: string;
}
