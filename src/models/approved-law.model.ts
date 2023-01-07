import { Card } from './card.model';

export class ApprovedLaw {
  card: Card;
  playerId: string;

  constructor({ card, playerId }: { card: Card; playerId: string }) {
    this.card = card;
    this.playerId = playerId;
  }
}
