import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CardFilter,
  CardFilterParams,
  HasFilterQueryCard,
} from 'src/common/filters/cards/card-filter.params';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.cardsService.create(createCardDto);
  }

  @HasFilterQueryCard()
  @Get()
  async findAll(@CardFilter() cardFilter: CardFilterParams) {
    const cacheKey = `cards_findAll_rarity_${cardFilter.rarity}`;

    const cachedData: object = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        isCached: true,
      };
    }

    const cards = await this.cardsService.findAll(cardFilter);

    const response = {
      data: cards,
      meta: {
        total: cards.length,
      },
    };

    await this.cacheManager.set(cacheKey, response, 6000);

    return { ...response, isCached: false };
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const card = await this.cardsService.findOne(id);
    return {
      data: card,
    };
  }

  @Patch('id/:id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const updatedCard = await this.cardsService.update(id, updateCardDto);
    return {
      data: updatedCard,
    };
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.cardsService.delete(id);
  }
}
