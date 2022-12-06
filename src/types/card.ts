const CardTypes = {
  law: 'law',
  action: 'action'
} as const;

export type CardType = typeof CardTypes[keyof typeof CardTypes];

export interface Card {
  type: CardType;
  title?: string;
  body: string;
  quickPlay: boolean;
}
