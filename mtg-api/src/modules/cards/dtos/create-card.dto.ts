import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rarity } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsString()
  released_date: Date;

  @ApiProperty()
  @IsString()
  mana_cost: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  power?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  toughness?: number;

  @ApiProperty()
  @IsString({ each: true })
  colors: string[];

  @ApiProperty()
  @IsNumber()
  cmc: number;

  @ApiProperty()
  @IsEnum(Rarity)
  rarity: Rarity;

  @ApiProperty()
  @IsNumber()
  price_in_usd: number;

  @ApiProperty()
  @IsNumber()
  foil_price_in_usd: number;
}
