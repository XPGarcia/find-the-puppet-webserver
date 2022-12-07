export class CardInGame {
  cardId: string;
  playerId?: string;
  inDeck: boolean;

  constructor({
    cardId,
    playerId,
    inDeck = true
  }: {
    cardId: string;
    playerId?: string;
    inDeck?: boolean;
  }) {
    this.cardId = cardId;
    this.playerId = playerId;
    this.inDeck = inDeck;
  }
}
