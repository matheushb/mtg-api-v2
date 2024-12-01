import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDeckDto } from './dtos/create-deck.dto';
import { UpdateDeckDto } from './dtos/update-deck.dto';
import { DeckSelectParams } from 'src/common/filters/deck/deck-select.params';

const DECK_SELECT: Prisma.DeckSelectScalar = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  user_id: true,
};

const DECK_SELECT_WITH_CARDS: Prisma.DeckSelect = {
  ...DECK_SELECT,
  cards: {
    select: {
      card: true,
    },
  },
};

@Injectable()
export class DecksRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDeckDto: CreateDeckDto) {
    return this.prismaService.deck.create({ data: createDeckDto });
  }

  findAll(filter: Prisma.DeckWhereInput, deckSelect: DeckSelectParams) {
    const decks = this.prismaService.deck.findMany({
      where: { AND: [filter] },
      select:
        deckSelect.showCards === 'true' ? DECK_SELECT_WITH_CARDS : DECK_SELECT,
    });

    return decks;
  }

  findOne(id: string) {
    const deck = this.prismaService.deck.findUnique({ where: { id } });
    return deck;
  }

  update(id: string, updateDeckDto: UpdateDeckDto) {
    const updatedDeck = this.prismaService.deck.update({
      where: { id },
      data: updateDeckDto,
    });

    return updatedDeck;
  }

  delete(id: string) {
    this.prismaService.deck.delete({ where: { id } });
  }
}
