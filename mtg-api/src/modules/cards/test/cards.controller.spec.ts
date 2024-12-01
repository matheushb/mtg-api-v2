import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from '../cards.controller';
import { CardsService } from '../cards.service';
import { CreateCardDto } from '../dtos/create-card.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('CardsController', () => {
  let controller: CardsController;
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
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

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  describe('create', () => {
    it('should create a card', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Test Card',
        released_date: new Date().toISOString() as any,
        mana_cost: '1G',
        type: 'Creature',
        text: 'Test description',
        colors: ['Green'],
        cmc: 2,
        rarity: 'COMMON',
        price_in_usd: 1.5,
        foil_price_in_usd: 2.0,
      };
      const result = {
        ...createCardDto,
        id: 'card123',
      };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createCardDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const result = [
        {
          id: 'card123',
          name: 'Test Card 1',
          released_date: new Date().toISOString(),
          mana_cost: '1G',
          type: 'Creature',
          text: 'Test description 1',
          colors: ['Green'],
          cmc: 2,
          rarity: 'COMMON',
          price_in_usd: 1.5,
          foil_price_in_usd: 2.0,
        },
        {
          id: 'card124',
          name: 'Test Card 2',
          released_date: new Date().toISOString(),
          mana_cost: '2G',
          type: 'Sorcery',
          text: 'Test description 2',
          colors: ['Green'],
          cmc: 3,
          rarity: 'RARE',
          price_in_usd: 3.5,
          foil_price_in_usd: 4.0,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll({})).toEqual({
        data: result,
        meta: {
          total: result.length,
        },
        isCached: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific card', async () => {
      const id = 'card123';
      const result = {
        id,
        name: 'Test Card',
        released_date: new Date().toISOString(),
        mana_cost: '1G',
        type: 'Creature',
        text: 'Test description',
        colors: ['Green'],
        cmc: 2,
        rarity: 'COMMON',
        price_in_usd: 1.5,
        foil_price_in_usd: 2.0,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(id)).toEqual({
        data: result,
      });
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      const id = 'card123';
      const updateCardDto: UpdateCardDto = {
        name: 'Updated Test Card',
        mana_cost: '2G',
      };
      const updatedCard = {
        id,
        name: 'Updated Test Card',
        released_date: new Date().toISOString(),
        mana_cost: '2G',
        type: 'Creature',
        text: 'Test description',
        colors: ['Green'],
        cmc: 2,
        rarity: 'COMMON',
        price_in_usd: 1.5,
        foil_price_in_usd: 2.0,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCard as any);

      expect(await controller.update(id, updateCardDto)).toEqual({
        data: updatedCard,
      });
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      const id = 'card123';

      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(id)).resolves.toBeUndefined();
    });
  });
});
