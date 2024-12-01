import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CardDeckService } from './card-deck.service';
import { UpdateCardDeckDto } from './dtos/update-card-deck.dto';
import { CreateCardDeckDto } from './dtos/create-card-deck.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('card-decks')
@Controller('card-decks')
export class CardDeckController {
  constructor(private readonly cardDeckService: CardDeckService) {}

  @Post()
  async create(@Body() createCardDeckDto: CreateCardDeckDto) {
    return await this.cardDeckService.create(createCardDeckDto);
  }

  @Get()
  async findAll() {
    const cardDeck = await this.cardDeckService.findAll();

    return {
      data: cardDeck,
      meta: {
        total: cardDeck.length,
      },
    };
  }

  @Get('card_id/:card_id/deck_id/:deck_id')
  async findOne(
    @Param('card_id') card_id: string,
    @Param('deck_id') deck_id: string,
  ) {
    const cardDeck = await this.cardDeckService.findOne(card_id, deck_id);
    return {
      data: cardDeck,
    };
  }

  @Patch('card_id/:card_id/deck_id/:deck_id')
  async update(
    @Param('card_id') card_id: string,
    @Param('deck_id') deck_id: string,
    @Body() updateCardDeckDto: UpdateCardDeckDto,
  ) {
    const updatedCardDeck = await this.cardDeckService.update(
      card_id,
      deck_id,
      updateCardDeckDto,
    );
    return {
      data: updatedCardDeck,
    };
  }

  @Delete('card_id/:card_id/deck_id/:deck_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('card_id') card_id: string,
    @Param('deck_id') deck_id: string,
  ) {
    await this.cardDeckService.delete(card_id, deck_id);
  }
}
