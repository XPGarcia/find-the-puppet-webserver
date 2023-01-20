import { getRandomId } from '../utils';
import { WssResponse } from '../dtos';
import { Room } from '../models';

const roomEventActions = ['create', 'join', 'leave', 'updateProfile'] as const;

export type RoomEventAction = typeof roomEventActions[number];

export class RoomEventManager {
  static rooms: Room[] = [];

  static createRoom(playerId: string, playerName: string): WssResponse {
    const room = new Room({
      id: getRandomId().toString(),
      hostName: playerName
    });
    room.newClientJoined(playerId, playerName);
    this.rooms.push(room);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: playerName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'private'
    };
  }

  static joinRoom(roomId: string, playerId: string, playerName: string): WssResponse {
    const room = this.getRoom(roomId);
    if (room.clients.length > 8) throw new Error('Maximum length of players in room');

    room.newClientJoined(playerId, playerName);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'broadcast'
    };
  }

  static leaveRoom(roomId: string, playerId: string): WssResponse {
    const room = this.getRoom(roomId);
    room.removeClient(playerId);
    if (!room) return;

    if (room.clients.length === 0) RoomEventManager.removeRoom(room.id);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      communicationType: 'broadcast'
    };
  }

  static updateProfile(roomId: string, playerId: string): WssResponse {
    const room = this.getRoom(roomId);
    const profile = room.getNewRandomProfile();
    room.setClientProfile(playerId, profile);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'broadcast'
    };
  }

  static getRoom(roomId: string): Room {
    return this.rooms.find((room) => room.id === roomId);
  }

  static removeRoom(roomId: string): void {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  static getResponse(eventName: RoomEventAction, payload?: any): WssResponse {
    switch (eventName) {
      case 'create':
        return this.createRoom(payload.playerId, payload.playerName);
      case 'join':
        return this.joinRoom(payload.roomId, payload.playerId, payload.playerName);
      case 'leave':
        return this.leaveRoom(payload.roomId, payload.playerId);
      case 'updateProfile':
        return this.updateProfile(payload.roomId, payload.playerId);
    }
  }
}
