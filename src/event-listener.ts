/* eslint-disable no-case-declarations */
import { ClientMessage, WssPartialResponse, WssResponse } from './dtos';
import {
  DeckEventAction,
  DeckEventManager,
  GameEventAction,
  GameEvents,
  RoomEventManager,
  VotingEventAction,
  VotingEventManager
} from './events';
import { RoomEventAction } from './events';
import { rooms } from './wss';

export class EventListener {
  static execute(message: ClientMessage): WssResponse {
    const room = rooms.find((room) => room.id === message.roomId);

    let wssResponse: WssResponse = room && {
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '',
      responseType: 'game',
      communicationType: 'private'
    };

    let partialResponse: WssPartialResponse;

    switch (message.eventType) {
      case 'room':
        const roomEventName = message.action as RoomEventAction;
        return RoomEventManager.getResponse(roomEventName, message.payload);
      case 'game':
        const gameEventName = message.action as GameEventAction;
        partialResponse = GameEvents.getResponse(room, gameEventName);
        break;
      case 'deck':
        const deckEventName = message.action as DeckEventAction;
        partialResponse = DeckEventManager.getResponse(room, deckEventName, message.payload);
        break;
      case 'voting':
        const votingEventName = message.action as VotingEventAction;
        partialResponse = VotingEventManager.getResponse(room, votingEventName, message.payload);
        break;
    }

    wssResponse = { ...wssResponse, ...partialResponse };

    return wssResponse;
  }
}
