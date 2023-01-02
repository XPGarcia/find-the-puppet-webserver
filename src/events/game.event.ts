import { Room } from 'src/models/room.model';
import { WssPartialResponse } from '../dtos';
import { GameMapper } from '../mappers';
import { Game } from '../models';
import { GameService } from '../services';

const gameEventActions = ['start', 'endTurn'] as const;

export type GameEventAction = typeof gameEventActions[number];

export class GameEvents {
  private static async start(room: Room): Promise<WssPartialResponse> {
    const playersIds = room.clients.map((client) => client.playerId);

    const { deck, playerInTurn, playerAsPresident, governmentPlayers, oppositionPlayers } =
      await GameService.setup(playersIds);

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
    console.log(room.game);
    const gameResponse = GameMapper.toResponse(room.game);

    return { responseType: 'game', message: JSON.stringify(gameResponse) };
  }

  private static endTurn(room: Room): WssPartialResponse {
    GameService.endTurn(room);

    const gameResponse = GameMapper.toResponse(room.game);

    return { responseType: 'game', message: JSON.stringify(gameResponse) };
  }

  static async getResponse(eventName: GameEventAction, room: Room): Promise<WssPartialResponse> {
    switch (eventName) {
      case 'start':
        return await this.start(room);
      case 'endTurn':
        return this.endTurn(room);
    }
  }
}
