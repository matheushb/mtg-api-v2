import { Test, TestingModule } from '@nestjs/testing';
import { CardDeckController } from '../card-deck.controller';
import { CreateCardDeckDto } from '../dtos/create-card-deck.dto';
import { CardDeckService } from '../card-deck.service';
import { UpdateCardDeckDto } from '../dtos/update-card-deck.dto';

describe('CardDeckController', () => {
  let controller: CardDeckController;
  let service: CardDeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardDeckController],
      providers: [
        {
          provide: CardDeckService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CardDeckController>(CardDeckController);
    service = module.get<CardDeckService>(CardDeckService);
  });

  describe('create', () => {
    it('should create a card-deck association', async () => {
      const createCardDeckDto: CreateCardDeckDto = {
        deck_id: 'deck123',
        card_id: 'card456',
      };
      const result = {
        ...createCardDeckDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createCardDeckDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all card-deck associations', async () => {
      const result = [
        {
          deck_id: 'deck123',
          card_id: 'card456',
        },
        {
          deck_id: 'deck789',
          card_id: 'card012',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toEqual({
        data: result,
        meta: {
          total: result.length,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific card-deck association', async () => {
      const card_id = 'card456';
      const deck_id = 'deck123';
      const result = {
        card_id,
        deck_id,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(card_id, deck_id)).toEqual({
        data: result,
      });
    });
  });

  describe('update', () => {
    it('should update a card-deck association', async () => {
      const card_id = 'card456';
      const deck_id = 'deck123';
      const updateCardDeckDto: UpdateCardDeckDto = {
        card_id: 'card789',
        deck_id: 'deck456',
      };
      const updatedCardDeck = {
        card_id: updateCardDeckDto.card_id,
        deck_id: updateCardDeckDto.deck_id,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCardDeck as any);

      expect(
        await controller.update(card_id, deck_id, updateCardDeckDto),
      ).toEqual({
        data: updatedCardDeck,
      });
    });
  });

  describe('delete', () => {
    it('should delete a card-deck association', async () => {
      const card_id = 'card456';
      const deck_id = 'deck123';

      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(
        controller.delete(card_id, deck_id),
      ).resolves.toBeUndefined();
    });
  });
});
