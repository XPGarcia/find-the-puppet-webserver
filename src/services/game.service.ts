import { random, shuffle } from '../utils';
import { Game, Card, PartialGame } from '../models';
import { DeckService } from './deck.service';

export class GameService {
  static currentGame: Game = {
    id: '1',
    numberOfPlayers: 0,
    playersIds: [],
    playerInTurn: '',
    playerAsPresident: '',
    turnsPlayed: 0,
    roundsPlayed: 0,
    roundsForNextElections: 0,
    governmentPlayers: [],
    oppositionPlayers: [],
    deck: [],
    approvedLaws: []
  };

  static setGame(partialGame: PartialGame) {
    this.currentGame = { ...this.currentGame, ...partialGame };
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
      deck: shuffle<Card>(deck),
      playerInTurn,
      playerAsPresident,
      governmentPlayers,
      oppositionPlayers
    };
  }

  static updateDeckAfterDraw(cardsDrawn: Card[]) {
    this.currentGame.deck.forEach((cardInDeck) => {
      cardsDrawn.forEach((cardDrawn) => {
        if (cardInDeck === cardDrawn) cardInDeck.inDeck = false;
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
