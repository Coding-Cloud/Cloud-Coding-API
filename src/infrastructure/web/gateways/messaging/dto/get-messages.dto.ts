import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @IsUUID()
  @ApiProperty()
  conversationId: string;

  @IsOptional()
  @ApiProperty()
  limit?: number;

  @IsOptional()
  @ApiProperty()
  offset?: number;
}
