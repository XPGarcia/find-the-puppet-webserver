import { Server } from 'socket.io';
import { CardAction } from './constants/card-action.constant';
import { Game } from './models';

interface ServerToClientEvents {
  gameStatus: (game: Game) => void;
  message: (message: string) => void;
}

interface ClientToServerEvents {
  execute: (action: CardAction) => void;
}

interface SocketData {
  game: Game;
}

interface Socket {
  io: Server<ClientToServerEvents, ServerToClientEvents, null, SocketData>;
  connect: (httpServer: any) => void;
}

export const socket: Socket = {
  io: null,
  connect: (httpServer: any) => {
    socket.io = new Server<ClientToServerEvents, ServerToClientEvents, null, SocketData>(
      httpServer,
      {}
    );
  }
};
