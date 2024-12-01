import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const allowedSelect = ['showCards'];

export type DeckSelectParams = {
  showCards?: string;
};

export const DeckSelect = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      showCards: request.query.showCards,
    };
  },
);

export const HasSelectQueryDeck = () => {
  return applyDecorators(
    ApiQuery({ name: 'showCards', type: Boolean, required: false }),
  );
};
