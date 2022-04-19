import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  content: string;

  @IsUUID()
  @ApiProperty()
  assetId: string;
}
