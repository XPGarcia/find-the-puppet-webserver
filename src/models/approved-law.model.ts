export class ApprovedLaw {
  playerId: string;
  cardId: string;

  constructor({ playerId, cardId }: { playerId: string; cardId: string }) {
    this.playerId = playerId;
    this.cardId = cardId;
  }
}
