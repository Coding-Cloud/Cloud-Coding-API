import { ApiProperty } from '@nestjs/swagger';

export class UsernameDto {
  @ApiProperty()
  username: string;
}
