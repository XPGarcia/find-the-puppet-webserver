import { Server } from 'socket.io';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

interface Socket {
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
}

export const socket: Socket = { io: null };

export const connect = (httpServer: any) => {
  socket.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      /* options */
    }
  );
};
