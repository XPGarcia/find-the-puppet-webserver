import { Room } from 'src/models/room.model';
import { WssPartialResponse } from '../dtos';
import { GameMapper } from '../mappers';
import { Game } from '../models';
import { GameService } from '../services';

const gameEventActions = ['start', 'endTurn'] as const;

export type GameEventAction = typeof gameEventActions[number];

export class GameEvents {
  private static start(room: Room): WssPartialResponse {
    const playersIds = room.clients.map((client) => client.playerId);

    const { deck, playerInTurn, playerAsPresident, governmentPlayers, oppositionPlayers } =
      GameService.setup(playersIds);

    const game: Game = {
      numberOfPlayers: playersIds.length,
      playersIds,
      playerInTurn,
      playerAsPresident,
      turnsPlayed: 0,
      roundsPlayed: 0,
      roundsForNextElections: 4,
      governmentPlayers,
      oppositionPlayers,
      deck,
      approvedLaws: []
    };
    GameService.setGame(room, game);
    const gameResponse = GameMapper.toResponse(room.game);

    return {
      responseType: 'game',
      message: JSON.stringify(gameResponse),
      communicationType: 'broadcast'
    };
  }

  private static endTurn(room: Room): WssPartialResponse {
    GameService.endTurn(room);

    const gameResponse = GameMapper.toResponse(room.game);

    return {
      responseType: 'game',
      message: JSON.stringify(gameResponse),
      communicationType: 'broadcast'
    };
  }

  static getResponse(room: Room, eventName: GameEventAction): WssPartialResponse {
    switch (eventName) {
      case 'start':
        return this.start(room);
      case 'endTurn':
        return this.endTurn(room);
    }
  }
}
