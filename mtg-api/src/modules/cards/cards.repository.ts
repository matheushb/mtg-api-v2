import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardsRepository {
  findByIdsBatch(ids: string[]) {
    return this.prismaService.card.findMany({ where: { id: { in: ids } } });
  }
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return await this.prismaService.card.create({ data: createCardDto });
  }

  async findAll(filter: Prisma.CardWhereInput) {
    const cards = await this.prismaService.card.findMany({
      where: { AND: [filter] },
    });

    return cards;
  }

  async findOne(id: string) {
    const card = await this.prismaService.card.findUnique({ where: { id } });
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const updatedCard = await this.prismaService.card.update({
      where: { id },
      data: updateCardDto,
    });

    return updatedCard;
  }

  async delete(id: string) {
    await this.prismaService.card.delete({ where: { id } });
  }
}
