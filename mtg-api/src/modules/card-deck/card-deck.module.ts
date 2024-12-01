import { Module } from '@nestjs/common';
import { CardDeckController } from './card-deck.controller';
import { CardDeckService } from './card-deck.service';
import { CardDeckRepository } from './card-deck.repository';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [CardsModule],
  controllers: [CardDeckController],
  providers: [CardDeckService, CardDeckRepository],
  exports: [CardDeckService],
})
export class CardDeckModule {}
