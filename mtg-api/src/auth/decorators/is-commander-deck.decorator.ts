import { Rarity } from '@prisma/client';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { CreateCardDto } from 'src/modules/cards/dtos/create-card.dto';

function areColorsValidForCommander(cards: CreateCardDto[]): boolean {
  const commanderCard = cards.find((card) => card.rarity === Rarity.MYTHIC);
  if (!commanderCard) return false;

  const commanderColors = commanderCard.colors;

  return cards.every((card) =>
    card.colors.every((color) => commanderColors.includes(color)),
  );
}

export function IsCommanderDeck(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCommanderDeck',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(cards: CreateCardDto[], _: ValidationArguments) {
          if (!cards || cards.length !== 100) {
            return false;
          }

          return areColorsValidForCommander(cards);
        },
        defaultMessage(_: ValidationArguments) {
          return 'O Deck deve conter 100 cartas, e todas as cartas devem conter cores do comandante.';
        },
      },
    });
  };
}
