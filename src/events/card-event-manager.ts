import { WssPartialResponse } from '../dtos';
import { Card, Room } from '../models';

export type CardEventAction = 'startAction' | 'endAction';

export class CardEventManager {
  private static startAction(card: Card): WssPartialResponse {
    return {
      responseType: 'card',
      message: JSON.stringify({ card }),
      communicationType: 'broadcast'
    };
  }

  private static endAction(card: Card): WssPartialResponse {
    return {
      responseType: 'card',
      message: JSON.stringify({}),
      communicationType: 'broadcast'
    };
  }

  static getResponse(room: Room, eventName: CardEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startAction':
        return this.startAction(payload.card);
      case 'endAction':
        return this.endAction(payload.card);
    }
  }
}
