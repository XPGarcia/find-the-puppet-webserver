import { GameResponse } from 'src/dtos';
import { Game } from '../types';

export class GameMapper {
  static toResponse(game: Game): GameResponse {
    return {
      id: game.id,
      numberOfPlayers: game.numberOfPlayers,
      playerInTurn: game.playerInTurn,
      playerAsPresident: game.playerAsPresident,
      turnsPlayed: game.turnsPlayed,
      roundsPlayed: game.roundsPlayed,
      roundsForNextElections: game.roundsForNextElections
    };
  }
}
