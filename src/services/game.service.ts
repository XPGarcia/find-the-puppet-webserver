import { random, shuffle } from '../utils';
import { CardInGame, Game } from '../types';
import { DeckService } from './deck.service';

export class GameService {
  static currentGame: Game;

  static setGame(game: Game) {
    this.currentGame = { ...game };
  }

  static async setup(playersIds: string[]) {
    const deck = await DeckService.new();

    const gpOne = random<string>(playersIds);
    const gpTwo = random<string>(playersIds.filter((id) => id !== gpOne));
    const governmentPlayers = [gpOne, gpTwo];

    const oppositionPlayers = playersIds.filter((id) => id !== gpOne && id !== gpTwo);

    const playerAsPresident = random<string>(playersIds);

    const presidentIndex = (playersIds as string[]).findIndex(
      (playerId) => playerId === playerAsPresident
    );

    const firstPlayerIndex = presidentIndex + 1 === playersIds.length ? 0 : presidentIndex + 1;
    const playerInTurn = playersIds[firstPlayerIndex];

    return {
      deck: shuffle<CardInGame>(deck),
      playerInTurn,
      playerAsPresident,
      governmentPlayers,
      oppositionPlayers
    };
  }

  static updateDeckAfterDraw(playerId: string, cardsDrawn: CardInGame[]) {
    this.currentGame.deck.forEach((cardInDeck) => {
      cardsDrawn.forEach((cardDrawn) => {
        if (cardInDeck === cardDrawn) {
          cardInDeck.inDeck = false;
          cardInDeck.playerId = playerId;
        }
      });
    });
  }

  static endTurn() {
    const playersIds = this.currentGame.playersIds;
    const playerIndex = playersIds.findIndex((id) => id === this.currentGame.playerInTurn);

    const nextPlayerIndex = playerIndex + 1 === playersIds.length ? 0 : playerIndex + 1;
    const playerInTurn = playersIds[nextPlayerIndex];

    const turnsPlayed = this.currentGame.turnsPlayed + 1;
    const roundsPlayed =
      turnsPlayed % this.currentGame.numberOfPlayers === 0
        ? this.endRound()
        : this.currentGame.roundsPlayed;

    this.setGame({ ...this.currentGame, playerInTurn, turnsPlayed, roundsPlayed });
  }

  static endRound() {
    const roundsPlayed = this.currentGame.roundsPlayed + 1;

    const roundsForNextElections = this.currentGame.roundsForNextElections - 1;

    this.currentGame.roundsForNextElections =
      roundsForNextElections <= 0 ? 4 : roundsForNextElections;

    return roundsPlayed;
  }
}
