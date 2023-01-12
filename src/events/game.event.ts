import { Room } from 'src/models/room.model';
import { WssPartialResponse } from '../dtos';
import { GameMapper } from '../mappers';
import { Game } from '../models';
import { GameService } from '../services';

const gameEventActions = ['start', 'endTurn'] as const;

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
      roundsForNextElections: 2,
      governmentPlayers,
      oppositionPlayers,
      deck,
      approvedLaws: []
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

  static getResponse(room: Room, eventName: GameEventAction): WssPartialResponse {
    switch (eventName) {
      case 'start':
        return this.start(room);
      case 'endTurn':
        return this.endTurn(room);
    }
  }
}
