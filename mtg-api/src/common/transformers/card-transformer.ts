import { Rarity } from '@prisma/client';
import { CreateCardDto } from 'src/modules/cards/dtos/create-card.dto';

export function transformCard(card: any): CreateCardDto {
  const baseCard = {
    id: card.id,
    name: card.name,
    released_date: card.released_at,
    mana_cost: card.mana_cost,
    type: card.type_line,
    text: card.oracle_text,
    colors: card.colors,
    cmc: card.cmc,
    rarity: card.rarity?.toUpperCase() || Rarity.COMMON,
    price_in_usd: Number(card.prices?.usd) ?? 0,
    foil_price_in_usd: Number(card.prices?.usd_foil) ?? 0,
  };

  if (!card.power && !card.toughness) {
    return { ...baseCard };
  } else {
    return {
      ...baseCard,
      power: Number(card.power) ?? 0,
      toughness: Number(card.toughness) ?? 0,
    };
  }
}
