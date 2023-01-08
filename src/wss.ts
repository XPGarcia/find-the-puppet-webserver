import { environment } from './configs';
import WebSocket, { WebSocketServer } from 'ws';
import app from './app';
import * as https from 'https';
import * as http from 'http';
import { ClientMessage } from './dtos';
import { EventListener } from './event-listener';
import { Room } from './models/room.model';
import * as fs from 'fs';

export const rooms: Room[] = [];

export const start = () => {
  const serverOptions = {
    cert: fs.readFileSync('src/certificate.crt'),
    key: fs.readFileSync('src/private.key')
  };

  const server = https.createServer(serverOptions, app);

  // const server = http.createServer(app);

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
      const room = rooms.find((room) => room.id === ws.roomId);
      room.removeClient(ws.playerId);
      const wssResponse = {
        responseType: 'room',
        roomId: room.id,
        hostName: room.hostName,
        clients: room.clients,
        message: '{}',
        communicationType: 'broadcast'
      };
      wss.broadcast(JSON.stringify(wssResponse), room.id);
    });

    ws.onerror = function () {
      console.log('Some Error occurred');
    };

    const playerId = wss.clients.size.toString();
    ws.playerId = playerId;
    ws.send(JSON.stringify({ responseType: 'connection', playerId }));
    console.log(`Client connected`);
  });

  server.listen(8443, () => {
    console.log('The WebSocket server is running on port 8443');
  });

  // server.listen(3000, () => {
  //   console.log('The WebSocket server is running on port 3000');
  // });
};
