import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CacheModule } from '@nestjs/cache-manager';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'testuser',
        password: 'testpassword',
        name: 'test@example.com',
      };
      const result = {
        id: 'user123',
        ...createUserDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createUserDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [
        {
          id: 'user123',
          name: 'testuser1',
          email: 'test1@example.com',
        },
        {
          id: 'user124',
          name: 'testuser2',
          email: 'test2@example.com',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toEqual({
        data: result,
        meta: {
          total: result.length,
        },
        isCached: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific user', async () => {
      const id = 'user123';
      const result = {
        id,
        name: 'testuser',
        email: 'test@example.com',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(id)).toEqual({
        data: result,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = 'user123';
      const updateUserDto: UpdateUserDto = {
        name: 'updateduser',
      };
      const updatedUser = {
        id,
        name: 'updateduser',
        email: 'test@example.com',
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser as any);

      expect(await controller.update(id, updateUserDto)).toEqual({
        data: updatedUser,
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = 'user123';

      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.delete(id)).resolves.toBeUndefined();
    });
  });
});
