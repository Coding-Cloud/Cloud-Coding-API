import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordPasswordResetDTO {
  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty()
  password: string;
}
