import { Game } from '../types';

export class GameService {
  static currentGame: Game;

  static setGame(game: Game) {
    this.currentGame = { ...game };
  }
}
