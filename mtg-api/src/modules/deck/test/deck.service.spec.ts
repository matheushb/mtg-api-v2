import { Test, TestingModule } from '@nestjs/testing';
import { DecksRepository } from '../deck.repository';
import { CreateDeckDto } from '../dtos/create-deck.dto';
import { UpdateDeckDto } from '../dtos/update-deck.dto';
import { DecksService } from '../deck.service';

describe('DecksService', () => {
  let service: DecksService;
  let decksRepository: DecksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecksService,
        {
          provide: DecksRepository,
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

    service = module.get<DecksService>(DecksService);
    decksRepository = module.get<DecksRepository>(DecksRepository);
  });

  describe('create', () => {
    it('should create a deck successfully', async () => {
      const createDeckDto: CreateDeckDto = {
        name: 'Test Deck',
        user_id: 'user123',
      };
      const result = {
        id: '1',
        ...createDeckDto,
      };

      jest.spyOn(decksRepository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createDeckDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all decks', async () => {
      const result = [
        {
          id: '1',
          name: 'Deck 1',
          user_id: 'user123',
        },
        {
          id: '2',
          name: 'Deck 2',
          user_id: 'user456',
        },
      ];

      jest.spyOn(decksRepository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll({}, {})).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a deck', async () => {
      const result = {
        id: '1',
        name: 'Test Deck',
        user_id: 'user123',
      };

      jest.spyOn(decksRepository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne('1')).toEqual({ data: result });
    });
  });

  describe('update', () => {
    it('should update a deck successfully', async () => {
      const id = '1';
      const updateDeckDto: UpdateDeckDto = {
        name: 'Updated Deck',
      };
      const updatedDeck = {
        id,
        name: 'Updated Deck',
        user_id: 'user123',
      };

      jest
        .spyOn(decksRepository, 'update')
        .mockResolvedValue(updatedDeck as any);

      expect(await service.update(id, updateDeckDto)).toEqual({
        data: updatedDeck,
      });
    });
  });

  describe('delete', () => {
    it('should delete a deck successfully', async () => {
      const id = '1';

      jest
        .spyOn(decksRepository, 'delete')
        .mockResolvedValue(undefined as never);

      await expect(service.delete(id)).resolves.toBeUndefined();
    });
  });
});
