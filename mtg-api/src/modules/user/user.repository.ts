import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const USER_SELECT_FIELDS: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};
@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
      select: USER_SELECT_FIELDS,
    });
  }

  findAll() {
    return this.prismaService.user.findMany({
      select: USER_SELECT_FIELDS,
    });
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: USER_SELECT_FIELDS,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
      select: USER_SELECT_FIELDS,
    });
  }

  delete(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: { ...USER_SELECT_FIELDS, password: true },
    });
  }
}
