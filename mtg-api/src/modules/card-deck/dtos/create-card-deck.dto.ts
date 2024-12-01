import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCardDeckDto {
  @IsString()
  @ApiProperty()
  deck_id: string;

  @IsString()
  @ApiProperty()
  card_id: string;
}
