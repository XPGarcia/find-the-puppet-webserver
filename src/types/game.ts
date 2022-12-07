import { CardInGame } from './card-in-game';

export class Game {
  id: string;
  numberOfPlayers: number;
  playerInTurn: string;
  playerAsPresident: string;
  turnsPlayed: number;
  roundsPlayed: number;
  governmentPlayers: string[];
  oppositionPlayers: string[];
  deck: CardInGame[];

  constructor({
    id,
    numberOfPlayers,
    playerInTurn,
    playerAsPresident,
    turnsPlayed,
    roundsPlayed,
    governmentPlayers,
    oppositionPlayers,
    deck
  }: {
    id: string;
    numberOfPlayers: number;
    playerInTurn: string;
    playerAsPresident: string;
    turnsPlayed: number;
    roundsPlayed: number;
    governmentPlayers: string[];
    oppositionPlayers: string[];
    deck: CardInGame[];
  }) {
    this.id = id;
    this.numberOfPlayers = numberOfPlayers;
    this.playerInTurn = playerInTurn;
    this.playerAsPresident = playerAsPresident;
    this.turnsPlayed = turnsPlayed;
    this.roundsPlayed = roundsPlayed;
    this.governmentPlayers = governmentPlayers;
    this.oppositionPlayers = oppositionPlayers;
    this.deck = deck;
  }
}
