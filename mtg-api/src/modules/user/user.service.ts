import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = !!(await this.findByEmail(createUserDto.email));

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    createUserDto.password = await this.bcryptService.hash(
      createUserDto.password,
    );

    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hash(
        updateUserDto.password,
      );
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
