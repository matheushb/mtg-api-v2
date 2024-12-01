import { BadRequestException, Injectable } from '@nestjs/common';
import {
  allowedFilters,
  CardFilterParams,
} from 'src/common/filters/cards/card-filter.params';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto) {
    if (isNaN(new Date(createCardDto.released_date).getTime())) {
      throw new BadRequestException('Invalid Date');
    }
    createCardDto.released_date = new Date(createCardDto.released_date);
    return await this.cardsRepository.create(createCardDto);
  }

  async findByIdBatch(ids: string[]) {
    return await this.cardsRepository.findByIdsBatch(ids);
  }

  async findAll(cardFilter: CardFilterParams) {
    const filter = {};

    for (const allowedFilter of allowedFilters) {
      if (cardFilter[allowedFilter]) {
        if (allowedFilter === 'rarity') {
          filter['rarity'] = { equals: cardFilter[allowedFilter] };
        }
      }
    }

    return await this.cardsRepository.findAll(filter);
  }

  async findOne(id: string) {
    const card = await this.cardsRepository.findOne(id);
    return {
      data: card,
    };
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const updatedCard = await this.cardsRepository.update(id, updateCardDto);
    return {
      data: updatedCard,
    };
  }

  async delete(id: string) {
    await this.cardsRepository.delete(id);
  }
}
