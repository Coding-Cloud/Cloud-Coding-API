import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMessageDTO {
  @IsUUID()
  @ApiProperty()
  messageId: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  content: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  assetId: string;
}
