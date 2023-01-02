import { environment } from './configs';
import WebSocket, { WebSocketServer } from 'ws';
import { ClientMessage, WssResponse } from './dtos';
import { EventListener } from './event-listener';
import { Room } from './models/room.model';

export const rooms: Room[] = [];

export const start = () => {
  const wss = new WebSocketServer({
    port: environment.port
  }) as WebSocketServer;

  wss.broadcast = function broadcast(data: string) {
    wss.clients.forEach(function each(client: WebSocket) {
      client.send(data);
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (data: string) => {
      try {
        const clientMessage = JSON.parse(data) as ClientMessage;
        if (clientMessage.eventType === 'room') {
          if (clientMessage.action === 'create') {
            const room = new Room({
              id: (rooms.length + 1).toString(),
              hostName: clientMessage.payload.playerName
            });
            rooms.push(room);
            const playerId = room.newClientJoined(clientMessage.payload.playerName);
            const serverResponse: WssResponse = {
              responseType: 'room',
              roomId: room.id,
              hostName: clientMessage.payload.playerName,
              playerId: playerId,
              clients: room.clients,
              message: '{}',
              status: 'INROOM'
            };
            wss.broadcast(JSON.stringify(serverResponse));
          } else if (clientMessage.action === 'join') {
            const room = rooms.find((room) => room.id === clientMessage.payload.roomId);
            const serverResponse: WssResponse = {
              responseType: 'room',
              roomId: room.id,
              hostName: room.hostName,
              playerId: room.newClientJoined(clientMessage.payload.playerName),
              clients: room.clients,
              message: '{}',
              status: 'INROOM'
            };
            wss.broadcast(JSON.stringify(serverResponse));
          }
        }

        const { responseType, message } = await EventListener.execute(
          clientMessage,
          clientMessage.roomId
        );
        const serverResponse: WssResponse = {
          roomId: clientMessage.roomId,
          playerId: clientMessage.playerId,
          clients: rooms.find((room) => room.id === clientMessage.roomId).clients,
          responseType,
          message
        };
        ws.send(JSON.stringify(serverResponse));
      } catch (err) {
        console.log(err);
      }
    });

    ws.on('close', () => {
      // clients = clients.filter((clientId) => clientId !== id);
      console.log(`Client has disconnected`);
    });

    ws.onerror = function () {
      console.log('Some Error occurred');
    };

    console.log(`Client connected`);
  });

  console.log(`The WebSocket server is running on port ${environment.port}`);
};
