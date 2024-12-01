import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CardDeckRepository } from './card-deck.repository';
import { CreateCardDeckDto } from './dtos/create-card-deck.dto';
import { UpdateCardDeckDto } from './dtos/update-card-deck.dto';

@Injectable()
export class CardDeckService {
  constructor(
    private readonly cardDeckRepository: CardDeckRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createCardDeckDto: CreateCardDeckDto) {
    const createdCardDeck = await this.cardDeckRepository.create(
      createCardDeckDto,
    );
    return createdCardDeck;
  }

  async findAll(): Promise<any[]> {
    const cacheKey = 'allCardDecks';
    let cardDeck = (await this.cacheManager.get(cacheKey)) as any[];

    if (!cardDeck) {
      cardDeck = await this.cardDeckRepository.findAll();
      await this.cacheManager.set(cacheKey, cardDeck, 300);
    }

    return cardDeck;
  }

  async findOne(card_id: string, deck_id: string) {
    const cacheKey = `cardDeck-${card_id}-${deck_id}`;
    let cardDeck = await this.cacheManager.get(cacheKey);

    if (!cardDeck) {
      cardDeck = await this.cardDeckRepository.findOne(card_id, deck_id);
      await this.cacheManager.set(cacheKey, cardDeck, 300);
    }

    return cardDeck;
  }

  async update(
    card_id: string,
    deck_id: string,
    updateCardDeckDto: UpdateCardDeckDto,
  ) {
    const updatedCardDeck = await this.cardDeckRepository.update(
      card_id,
      deck_id,
      updateCardDeckDto,
    );
    const cacheKey = `cardDeck-${card_id}-${deck_id}`;
    await this.cacheManager.set(cacheKey, updatedCardDeck, 300);
    return updatedCardDeck;
  }

  async delete(card_id: string, deck_id: string) {
    await this.cardDeckRepository.delete(card_id, deck_id);
    const cacheKey = `cardDeck-${card_id}-${deck_id}`;
    await this.cacheManager.del(cacheKey);
  }
}
