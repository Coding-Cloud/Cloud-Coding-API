import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetCredentialsDTO {
  @IsEmail()
  @ApiProperty()
  email: string;
}
