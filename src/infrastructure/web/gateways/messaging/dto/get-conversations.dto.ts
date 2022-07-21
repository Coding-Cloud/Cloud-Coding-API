import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetConversationsDto {
  @IsString()
  @ApiProperty()
  search: string;

  @IsOptional()
  @ApiProperty()
  limit?: number;

  @IsOptional()
  @ApiProperty()
  offset?: number;
}
