import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { IsCommanderDeck } from 'src/auth/decorators/is-commander-deck.decorator';
import { transformCard } from 'src/common/transformers/card-transformer';
import { CreateCardDto } from 'src/modules/cards/dtos/create-card.dto';

export class ImportDeckDto {
  @IsString()
  @ApiProperty()
  name: string;

  @Transform(({ value }) => value.map(transformCard))
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @IsCommanderDeck()
  @ApiProperty({
    type: [CreateCardDto],
    description: 'Array of CreateCardDto',
  })
  cards: CreateCardDto[];
}
