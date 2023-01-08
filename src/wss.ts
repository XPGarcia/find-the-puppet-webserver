import { environment } from './configs';
import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'https';
import { ClientMessage } from './dtos';
import { EventListener } from './event-listener';
import { Room } from './models/room.model';
import * as fs from 'fs';

export const rooms: Room[] = [];

export const start = () => {
  const server = createServer({
    cert: fs.readFileSync('src/certificate.crt'),
    key: fs.readFileSync('src/private.key')
  });

  const wss = new WebSocketServer({
    server
  }) as WebSocketServer;

  wss.broadcast = function broadcast(data: string, roomId: string) {
    wss.clients.forEach(function each(client: WebSocket) {
      if (client.roomId === roomId) client.send(data);
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: string) => {
      try {
        const clientMessage = JSON.parse(data) as ClientMessage;
        console.log(clientMessage);
        if (!clientMessage.eventType) return;

        const wssResponse = EventListener.execute(clientMessage);
        ws.roomId = wssResponse.roomId;
        console.log(wssResponse);

        if (wssResponse.communicationType === 'private') {
          ws.send(JSON.stringify(wssResponse));
        } else {
          wss.broadcast(JSON.stringify(wssResponse), wssResponse.roomId);
        }
      } catch (err) {
        console.log(err);
      }
    });

    ws.on('close', () => {
      console.log(`Client has disconnected`);
    });

    ws.onerror = function () {
      console.log('Some Error occurred');
    };

    const playerId = wss.clients.size.toString();
    ws.send(JSON.stringify({ responseType: 'connection', playerId }));
    console.log(`Client connected`);
  });

  server.listen(environment.port, () => {
    console.log(`The WebSocket server is running on port ${environment.port}`);
  });
};
