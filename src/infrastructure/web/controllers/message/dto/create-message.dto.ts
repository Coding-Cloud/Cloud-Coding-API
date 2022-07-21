import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @ApiProperty()
  content: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  assetId: string;
}
