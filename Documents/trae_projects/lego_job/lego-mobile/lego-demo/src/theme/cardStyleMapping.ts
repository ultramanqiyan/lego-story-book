import { CardStyleType } from '../types/styles';

export const BOOK_TYPE_TO_CARD_STYLE: Record<string, CardStyleType> = {
  children: CardStyleType.CARTOON,
  magic: CardStyleType.CRYSTAL,
  urban: CardStyleType.CLASSIC,
  mechanical: CardStyleType.CYBERPUNK,
};

export const getCardStyleForBookType = (bookType: string): CardStyleType => {
  return BOOK_TYPE_TO_CARD_STYLE[bookType] || CardStyleType.CLASSIC;
};

export default BOOK_TYPE_TO_CARD_STYLE;
