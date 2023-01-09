import { WssResponse } from '../dtos';
import { Room } from '../models';
import { rooms } from '../wss';

const roomEventActions = ['create', 'join', 'leave', 'updateProfile'] as const;

export type RoomEventAction = typeof roomEventActions[number];

export class RoomEventManager {
  static createRoom(playerId: string, playerName: string): WssResponse {
    const room = new Room({
      id: (rooms.length + 1).toString(),
      hostName: playerName
    });
    room.newClientJoined(playerId, playerName);
    rooms.push(room);
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
    const room = rooms.find((room) => room.id === roomId);
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
    const room = rooms.find((room) => room.id === roomId);
    room.removeClient(playerId);
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
    const room = rooms.find((room) => room.id === roomId);
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
