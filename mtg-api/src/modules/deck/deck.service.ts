import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import {
  allowedFilters,
  DeckFilterParams,
} from 'src/common/filters/deck/deck-filter.params';
import { DeckSelectParams } from 'src/common/filters/deck/deck-select.params';
import { DecksRepository } from './deck.repository';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import { RequestUser } from 'src/auth/decorators/user-from-request.decorator';
import { transformCard } from 'src/common/transformers/card-transformer';
import { CardsService } from '../cards/cards.service';
import { CardDeckService } from '../card-deck/card-deck.service';
import { writeFileSync } from 'fs';
import { ScyfallGateway } from 'src/gateways/scyfall.gateway';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DecksService {
  constructor(
    private readonly decksRepository: DecksRepository,
    private readonly cardsService: CardsService,
    private readonly cardDeckService: CardDeckService,
    private readonly scyfallGateway: ScyfallGateway,
    @Inject('RABBITMQ_WEBSOCKET') private readonly client: ClientProxy,
  ) {}

  async create(createDeckDto: CreateDeckDto) {
    const deck = await this.decksRepository.create(createDeckDto);

    await this.sendDeckUpdateMessage(
      createDeckDto.user_id,
      'Deck criado com sucesso!',
    );

    return deck;
  }

  async findAll(deckFilter: DeckFilterParams, deckSelect: DeckSelectParams) {
    const filter = {};

    for (const allowedFilter of allowedFilters) {
      if (deckFilter[allowedFilter]) {
        if (allowedFilter === 'userId') {
          filter['user_id'] = deckFilter[allowedFilter];
        }
      }
    }

    return await this.decksRepository.findAll(filter, deckSelect);
  }

  async findOne(id: string) {
    const deck = await this.decksRepository.findOne(id);
    return {
      data: deck,
    };
  }

  async update(id: string, updateDeckDto: UpdateDeckDto) {
    const updatedDeck = await this.decksRepository.update(id, updateDeckDto);

    this.sendDeckUpdateMessage(
      updateDeckDto.user_id,
      'Deck atualizado com sucesso!',
    );

    return {
      data: updatedDeck,
    };
  }

  async delete(id: string) {
    const deletedDeck = await this.decksRepository.delete(id);

    await this.sendDeckUpdateMessage(
      deletedDeck.user_id,
      'Deck deletado com sucesso!',
    );
  }

  private async sendDeckUpdateMessage(user_id: string, message: string) {
    await this.client.connect();
    this.client.emit('deck_updates_queue', {
      data: {
        user_id,
        message,
      },
    });
  }

  async seedDeck(user: RequestUser, deckName: string, col: string) {
    const color = col.toUpperCase();
    if (color && !/[WUBRG]/.test(color)) {
      throw new BadRequestException('Invalid color string, must be WUBRG');
    }

    const leaderResponse = await this.scyfallGateway.getDeckLeader(color);

    const leader = leaderResponse.data.data[0];

    const colors = leader.colors.join('');
    const cards = [];

    const transformedLeader = transformCard(leader);

    const leaderExists = await this.cardsService.findOne(transformedLeader.id);

    if (!leaderExists.data) {
      const savedLeader = await this.cardsService.create(transformedLeader);
      cards.push(savedLeader);
    } else {
      cards.push(leaderExists.data);
    }

    const cardsResponse = await this.scyfallGateway.getDeckCards(colors);

    const cardIds = cardsResponse.data.data.map((card) => card.id);
    const existingCards = await this.cardsService.findByIdBatch(cardIds);

    const existingCardsMap = new Map(
      existingCards.map((card) => [card.id, card]),
    );

    let x = 0;
    while (cards.length < 100 && x < cardsResponse.data.data.length) {
      const card = cardsResponse.data.data[x];

      if (card.name.includes('//')) {
        x++;
        continue;
      }

      const transformedCard = transformCard(card);
      let cardToSave = existingCardsMap.get(transformedCard.id);

      if (!cardToSave) {
        cardToSave = await this.cardsService.create(transformedCard);
      }

      cards.push(cardToSave);
      x++;
    }

    const deck = await this.create({
      name: deckName,
      user_id: user.id,
    });

    const createdCardsDataPromises = cards.map((card) =>
      this.cardDeckService.create({
        card_id: card.id,
        deck_id: deck.id,
      }),
    );

    await Promise.all(createdCardsDataPromises);

    writeFileSync('deck.json', JSON.stringify(cards, null, 2));
  }

  async importDeck(user: RequestUser, deckName: string, cards: any) {
    if (!cards || cards.length !== 100) {
      throw new BadRequestException('O deck deve conter 100 cartas.');
    }

    const commanderCard = cards.find((card) => card.rarity === 'MYTHIC');
    if (!commanderCard) {
      throw new BadRequestException(
        'O deck deve conter uma carta comandante (MYTHIC).',
      );
    }

    const deck = await this.create({
      name: deckName,
      user_id: user.id,
    });

    const existingCards = await this.cardsService.findByIdBatch(
      cards.map((card) => card.id),
    );
    const existingCardsMap = new Map(
      existingCards.map((card) => [card.id, card]),
    );

    const cardsToSave = await Promise.all(
      cards.map(async (transformedCard) => {
        let cardToSave = existingCardsMap.get(transformedCard.id);
        if (!cardToSave) {
          cardToSave = await this.cardsService.create(transformedCard);
        }
        return cardToSave;
      }),
    );

    const createdCardsDataPromises = cardsToSave.map((card) =>
      this.cardDeckService.create({
        card_id: card.id,
        deck_id: deck.id,
      }),
    );

    await Promise.all(createdCardsDataPromises);

    writeFileSync('imported-deck.json', JSON.stringify(cardsToSave, null, 2));
  }
}
