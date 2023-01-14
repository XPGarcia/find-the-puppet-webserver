import { Room } from 'src/models/room.model';
import { WssPartialResponse } from '../dtos';
import { GameMapper } from '../mappers';
import { Game } from '../models';
import { GameService } from '../services';

const gameEventActions = ['start', 'endTurn', 'update'] as const;

export type GameEventAction = typeof gameEventActions[number];

export class GameEvents {
  private static start(room: Room): WssPartialResponse {
    const players = [...room.clients];

    const { deck, playerInTurn, playerAsPresident, governmentPlayers, oppositionPlayers } =
      GameService.setup(players.map((player) => player.playerId));

    const game = new Game({
      numberOfPlayers: players.length,
      players,
      playerInTurn,
      playerAsPresident,
      turnsPlayed: 0,
      roundsPlayed: 0,
      roundsForNextElections: 4,
      governmentPlayers,
      oppositionPlayers,
      deck,
      approvedLaws: [],
      blockedPlayers: []
    });
    GameService.setGame(room, game);
    const gameResponse = GameMapper.toResponse(room.game);

    return {
      responseType: 'game',
      message: JSON.stringify(gameResponse),
      communicationType: 'broadcast'
    };
  }

  private static endTurn(room: Room): WssPartialResponse {
    const gameStatus = GameService.checkWinConditionByLaws(room.game);

    GameService.endTurn(room);

    const gameResponse = GameMapper.toResponse(room.game);

    return {
      responseType: 'game',
      message: JSON.stringify(gameResponse),
      communicationType: 'broadcast',
      status: gameStatus
    };
  }

  private static update(room: Room, game: Game): WssPartialResponse {
    GameService.setGame(room, { ...game });
    const gameStatus = GameService.checkWinConditionByLaws(room.game);

    const gameResponse = GameMapper.toResponse(room.game);

    return {
      responseType: 'game',
      message: JSON.stringify(gameResponse),
      communicationType: 'broadcast',
      status: gameStatus
    };
  }

  static getResponse(room: Room, eventName: GameEventAction, payload: any): WssPartialResponse {
    switch (eventName) {
      case 'start':
        return this.start(room);
      case 'endTurn':
        return this.endTurn(room);
      case 'update':
        return this.update(room, payload.game);
    }
  }
}
