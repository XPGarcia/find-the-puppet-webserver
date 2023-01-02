import { WssResponse } from '../dtos';
import { CardMapper } from '../mappers';
import { DeckService } from '../services';

const deckEventActions = ['draw', 'drawByIds', 'look'] as const;

export type DeckEventAction = typeof deckEventActions[number];

export class DeckEventManager {
  private static draw(quantity: number): WssResponse {
    const cards = DeckService.draw({ quantity });

    const cardResponse = CardMapper.toResponses(cards);

    return { responseType: 'card', message: JSON.stringify(cardResponse) };
  }

  private static drawByIds(cardsIds: string[]): WssResponse {
    const cards = DeckService.drawByIds(cardsIds);

    return { responseType: 'card', message: JSON.stringify(cards) };
  }

  private static look(): WssResponse {
    const deck = DeckService.look();

    return { responseType: 'card', message: JSON.stringify(deck) };
  }

  static getResponse(eventName: DeckEventAction, payload?: any): WssResponse {
    switch (eventName) {
      case 'draw':
        return this.draw(payload.quantity);
      case 'drawByIds':
        return this.drawByIds(payload.cardsIds);
      case 'look':
        return this.look();
    }
  }
}
