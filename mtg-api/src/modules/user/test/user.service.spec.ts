import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BcryptService } from '../../../common/bcrypt/bcrypt.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: BcryptService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const result = {
        id: '1',
        name: 'Test User',
        email: createUserDto.email,
        password: hashedPassword,
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
        Deck: [],
      };

      jest.spyOn(bcryptService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createUserDto)).toEqual(result);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: createUserDto.email,
        password: 'hashedPassword',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
        Deck: [],
      } as any);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
        Deck: [],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne('1')).toEqual(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update a user successfully', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        password: 'newPassword',
      };
      const hashedPassword = 'hashedNewPassword';
      const updatedUser = {
        id,
        name: 'Updated User',
        email: 'test@example.com',
        password: hashedPassword,
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
        Deck: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser as any);
      jest.spyOn(bcryptService, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(updatedUser as any);

      expect(await service.update(id, updateUserDto)).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const id = '1';
      const userToDelete = {
        id,
        name: 'User to Delete',
        email: 'delete@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
        Deck: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(userToDelete as any);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await expect(service.delete(id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user to delete is not found', async () => {
      const id = '1';

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
