import { Test, TestingModule } from '@nestjs/testing';
import { CardDeckService } from '../card-deck.service';
import { CardDeckRepository } from '../card-deck.repository';
import { CreateCardDeckDto } from '../dtos/create-card-deck.dto';
import { UpdateCardDeckDto } from '../dtos/update-card-deck.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('CardDeckService', () => {
  let service: CardDeckService;
  let cardDeckRepository: CardDeckRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        CardDeckService,
        {
          provide: CardDeckRepository,
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

    service = module.get<CardDeckService>(CardDeckService);
    cardDeckRepository = module.get<CardDeckRepository>(CardDeckRepository);
  });

  describe('create', () => {
    it('should create a card-deck association successfully', async () => {
      const createCardDeckDto: CreateCardDeckDto = {
        deck_id: 'deck123',
        card_id: 'card456',
      };
      const result = {
        ...createCardDeckDto,
      };

      jest.spyOn(cardDeckRepository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createCardDeckDto)).toEqual(result);
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

      jest
        .spyOn(cardDeckRepository, 'findAll')
        .mockResolvedValue(result as any);

      expect(await service.findAll()).toEqual(result);
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

      jest
        .spyOn(cardDeckRepository, 'findOne')
        .mockResolvedValue(result as any);

      expect(await service.findOne(card_id, deck_id)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a card-deck association successfully', async () => {
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

      jest
        .spyOn(cardDeckRepository, 'update')
        .mockResolvedValue(updatedCardDeck as any);

      expect(await service.update(card_id, deck_id, updateCardDeckDto)).toEqual(
        updatedCardDeck,
      );
    });
  });

  describe('delete', () => {
    it('should delete a card-deck association successfully', async () => {
      const card_id = 'card456';
      const deck_id = 'deck123';

      jest.spyOn(cardDeckRepository, 'delete').mockResolvedValue(undefined);

      await expect(service.delete(card_id, deck_id)).resolves.toBeUndefined();
    });
  });
});
