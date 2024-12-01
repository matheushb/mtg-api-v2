import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const allowedFilters = ['userId'];

export type DeckFilterParams = {
  userId?: string;
};

export const DeckFilter = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      userId: request.query.userId,
    };
  },
);

export const HasFilterQueryDeck = () => {
  return applyDecorators(
    ApiQuery({ name: 'userId', type: String, required: false }),
  );
};
