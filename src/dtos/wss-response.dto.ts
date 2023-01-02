import { GameStatus } from '../models';

export interface WssResponse {
  responseType: 'room' | 'game' | 'card';
  roomId: string;
  hostName?: string;
  playerId: string;
  clients: { playerId: string; playerName: string }[];
  status?: GameStatus;
  message: string;
}

export interface WssPartialResponse {
  responseType: 'room' | 'game' | 'card';
  message: string;
}
