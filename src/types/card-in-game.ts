import { Card } from './card';

export class CardInGame {
  card: Card;
  playerId?: string;
  inDeck: boolean;

  constructor({
    card,
    playerId,
    inDeck = true
  }: {
    card: Card;
    playerId?: string;
    inDeck?: boolean;
  }) {
    this.card = card;
    this.playerId = playerId;
    this.inDeck = inDeck;
  }
}
