import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from '../cards.service';
import { CardsRepository } from '../cards.repository';
import { CreateCardDto } from '../dtos/create-card.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import { BadRequestException } from '@nestjs/common';
import { Rarity } from '@prisma/client';

describe('CardsService', () => {
  let service: CardsService;
  let cardsRepository: CardsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: CardsRepository,
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

    service = module.get<CardsService>(CardsService);
    cardsRepository = module.get<CardsRepository>(CardsRepository);
  });

  describe('create', () => {
    it('should create a card successfully', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Test Card',
        released_date: '2024-01-01' as any,
        mana_cost: '1G',
        type: 'Creature',
        text: 'Test card text',
        colors: ['Green'],
        cmc: 2,
        rarity: Rarity.COMMON,
        price_in_usd: 1.99,
        foil_price_in_usd: 2.99,
      };
      const result = {
        id: '1',
        ...createCardDto,
        released_date: new Date(createCardDto.released_date),
      };

      jest.spyOn(cardsRepository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createCardDto)).toEqual(result);
    });

    it('should throw BadRequestException if released_date is invalid', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Test Card',
        released_date: 'invalid-date' as any,
        mana_cost: '1G',
        type: 'Creature',
        text: 'Test card text',
        colors: ['Green'],
        cmc: 2,
        rarity: Rarity.COMMON,
        price_in_usd: 1.99,
        foil_price_in_usd: 2.99,
      };

      await expect(service.create(createCardDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const result = [
        {
          id: '1',
          name: 'Card 1',
          released_date: new Date('2024-01-01'),
          mana_cost: '1G',
          type: 'Creature',
          text: 'Card 1 text',
          colors: ['Green'],
          cmc: 2,
          rarity: Rarity.COMMON,
          price_in_usd: 1.99,
          foil_price_in_usd: 2.99,
        },
        {
          id: '2',
          name: 'Card 2',
          released_date: new Date('2024-02-01'),
          mana_cost: '2U',
          type: 'Sorcery',
          text: 'Card 2 text',
          colors: ['Blue'],
          cmc: 3,
          rarity: Rarity.UNCOMMON,
          price_in_usd: 2.99,
          foil_price_in_usd: 3.99,
        },
      ];

      jest.spyOn(cardsRepository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll({})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a card', async () => {
      const result = {
        id: '1',
        name: 'Test Card',
        released_date: new Date('2024-01-01'),
        mana_cost: '1G',
        type: 'Creature',
        text: 'Test card text',
        colors: ['Green'],
        cmc: 2,
        rarity: Rarity.COMMON,
        price_in_usd: 1.99,
        foil_price_in_usd: 2.99,
      };

      jest.spyOn(cardsRepository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne('1')).toEqual({ data: result });
    });
  });

  describe('update', () => {
    it('should update a card successfully', async () => {
      const id = '1';
      const updateCardDto: UpdateCardDto = {
        name: 'Updated Card',
      };
      const updatedCard = {
        id,
        name: 'Updated Card',
        released_date: new Date('2024-01-01'),
        mana_cost: '1G',
        type: 'Creature',
        text: 'Updated card text',
        colors: ['Green'],
        cmc: 2,
        rarity: Rarity.COMMON,
        price_in_usd: 1.99,
        foil_price_in_usd: 2.99,
      };

      jest
        .spyOn(cardsRepository, 'update')
        .mockResolvedValue(updatedCard as any);

      expect(await service.update(id, updateCardDto)).toEqual({
        data: updatedCard,
      });
    });
  });

  describe('delete', () => {
    it('should delete a card successfully', async () => {
      const id = '1';

      jest.spyOn(cardsRepository, 'delete').mockResolvedValue(undefined);

      await expect(service.delete(id)).resolves.toBeUndefined();
    });
  });
});
