import { Test, TestingModule } from '@nestjs/testing';
import { DecksController } from '../deck.controller';
import { DecksService } from '../deck.service';
import { CreateDeckDto } from '../dtos/create-deck.dto';
import { UpdateDeckDto } from '../dtos/update-deck.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('DecksController', () => {
  let controller: DecksController;
  let service: DecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [DecksController],
      providers: [
        {
          provide: DecksService,
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

    controller = module.get<DecksController>(DecksController);
    service = module.get<DecksService>(DecksService);
  });

  describe('create', () => {
    it('should create a deck', async () => {
      const createDeckDto: CreateDeckDto = {
        name: 'Test Deck',
        user_id: 'user123',
      };
      const result = {
        ...createDeckDto,
        id: 'deck123',
      };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createDeckDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all decks', async () => {
      const result = [
        {
          id: 'deck123',
          name: 'Test Deck 1',
          user_id: 'user123',
        },
        {
          id: 'deck124',
          name: 'Test Deck 2',
          user_id: 'user124',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll({}, {})).toEqual({
        data: result,
        meta: {
          total: result.length,
        },
        isCached: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific deck', async () => {
      const id = 'deck123';
      const result = {
        id,
        name: 'Test Deck',
        user_id: 'user123',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(id)).toEqual({
        data: result,
      });
    });
  });

  describe('update', () => {
    it('should update a deck', async () => {
      const id = 'deck123';
      const updateDeckDto: UpdateDeckDto = {
        name: 'Updated Test Deck',
      };
      const updatedDeck = {
        id,
        name: 'Updated Test Deck',
        user_id: 'user123',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedDeck as any);

      expect(await controller.update(id, updateDeckDto)).toEqual({
        data: updatedDeck,
      });
    });
  });

  describe('delete', () => {
    it('should delete a deck', async () => {
      const id = 'deck123';

      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(id)).resolves.toBeUndefined();
    });
  });
});
