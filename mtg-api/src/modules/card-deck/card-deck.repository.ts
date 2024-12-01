import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCardDeckDto } from './dtos/create-card-deck.dto';
import { UpdateCardDeckDto } from './dtos/update-card-deck.dto';

@Injectable()
export class CardDeckRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCardDeckDto: CreateCardDeckDto) {
    try {
      return await this.prismaService.cardDeck.create({
        data: createCardDeckDto,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async findAll() {
    const cardDecks = await this.prismaService.cardDeck.findMany();

    return cardDecks;
  }

  async findOne(card_id: string, deck_id: string) {
    const cardDeck = await this.prismaService.cardDeck.findUnique({
      where: { deck_id_card_id: { card_id, deck_id } },
    });
    return cardDeck;
  }

  async update(
    card_id: string,
    deck_id: string,
    updateDeckDto: UpdateCardDeckDto,
  ) {
    const updatedDeck = await this.prismaService.cardDeck.update({
      where: { deck_id_card_id: { card_id, deck_id } },
      data: updateDeckDto,
    });

    return updatedDeck;
  }

  async delete(card_id: string, deck_id: string) {
    await this.prismaService.cardDeck.delete({
      where: { deck_id_card_id: { card_id, deck_id } },
    });
  }
}
