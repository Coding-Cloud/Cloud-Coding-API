import { ApiProperty } from '@nestjs/swagger';

export class ProjectNameDto {
  @ApiProperty()
  name: string;
}
