const CardTypes = {
  law: 'law',
  action: 'action'
} as const;

export type CardType = typeof CardTypes[keyof typeof CardTypes];

export class Card {
  id?: string;
  type: CardType;
  title?: string;
  body: string;
  quickPlay: boolean;

  constructor({
    id,
    type,
    title,
    body,
    quickPlay
  }: {
    id?: string;
    type: CardType;
    title?: string;
    body: string;
    quickPlay: boolean;
  }) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.body = body;
    this.quickPlay = quickPlay;
  }
}
