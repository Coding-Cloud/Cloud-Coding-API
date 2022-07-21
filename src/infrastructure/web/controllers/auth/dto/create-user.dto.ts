import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
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

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
