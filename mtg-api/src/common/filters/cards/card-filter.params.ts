import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Rarity } from '@prisma/client';

export const allowedFilters = ['rarity'];

export type CardFilterParams = {
  rarity?: Rarity;
};

export const CardFilter = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      rarity: request.query.rarity,
    };
  },
);

export const HasFilterQueryCard = () => {
  return applyDecorators(
    ApiQuery({
      name: 'rarity',
      required: false,
      enum: Rarity,
    }),
  );
};
