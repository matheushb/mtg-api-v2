import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;
}
