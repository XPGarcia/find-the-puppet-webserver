import server from './server';
import WebSocket, { WebSocketServer } from 'ws';
import { ClientMessage } from './dtos';
import { EventListener } from './event-listener';
import { getRandomId } from './utils';
import { RoomEventManager } from './events';

export const wss = new WebSocketServer({
  server
}) as WebSocketServer;

export const start = () => {
  wss.broadcast = function broadcast(data: string, roomId: string) {
    wss.clients.forEach(function each(client: WebSocket) {
      if (client.roomId === roomId) client.send(data);
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: string) => onMessage(ws, data));

    ws.on('close', () => onClose(ws));

    ws.onerror = onError;

    onConnection(ws);
  });
};

function onMessage(ws: WebSocket, data: string) {
  try {
    const clientMessage = JSON.parse(data) as ClientMessage;
    console.log(clientMessage);
    if (!clientMessage.eventType) return;

    const room = RoomEventManager.getRoom(clientMessage.roomId);
    const wssResponse = EventListener.execute(room, clientMessage);
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
}

function onClose(ws: WebSocket) {
  try {
    const room = RoomEventManager.getRoom(ws.roomId);
    if (!room) return;

    room.removeClient(ws.playerId);
    if (room.clients.length === 0) RoomEventManager.removeRoom(room.id);
    const wssResponse = {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      communicationType: 'broadcast'
    };
    wss.broadcast(JSON.stringify(wssResponse), room.id);
    console.log(`Client has disconnected`);
  } catch (err) {
    console.log(err);
  }
}

function onError() {
  console.log('Some Error occurred');
}

function onConnection(ws: WebSocket) {
  const playerId = getRandomId().toString();
  ws.playerId = playerId;
  ws.send(JSON.stringify({ responseType: 'connection', playerId }));
  console.log(`Client connected`);
}
