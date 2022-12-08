export class ApprovedLaw {
  cardId: string;
  playerId: string;

  constructor({ cardId, playerId }: { cardId: string; playerId: string }) {
    this.cardId = cardId;
    this.playerId = playerId;
  }
}
