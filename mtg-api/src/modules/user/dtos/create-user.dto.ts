import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
