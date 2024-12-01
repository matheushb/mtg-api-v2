import { PartialType } from '@nestjs/swagger';
import { CreateCardDeckDto } from './create-card-deck.dto';

export class UpdateCardDeckDto extends PartialType(CreateCardDeckDto) {}
