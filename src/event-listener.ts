import { ClientMessage, WssPartialResponse } from './dtos';
import { GameEventAction, GameEvents } from './events';
import { rooms } from './wss';

export class EventListener {
  static async execute(message: ClientMessage, roomId: string): Promise<WssPartialResponse> {
    const room = rooms.find((room) => room.id === roomId);

    switch (message.eventType) {
      case 'game':
        return await GameEvents.getResponse(message.action as GameEventAction, room);
    }
  }
}
