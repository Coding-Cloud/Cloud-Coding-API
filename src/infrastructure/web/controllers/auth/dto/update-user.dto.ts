import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  firstname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  lastname: string;

  @IsDateString()
  @ApiProperty()
  birthdate: Date;

  @IsEmail()
  @ApiProperty()
  email: string;
}
