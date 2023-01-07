import { ApprovedLaw } from './approved-law.model';
import { Card } from './card.model';

const gameStatuses = [
  'INROOM',
  'WAITING',
  'VOTING',
  'PLAYING',
  'DEMOCRATS_WON',
  'FASCISTS_WON'
] as const;

export type GameStatus = typeof gameStatuses[number];

export class Game {
  id?: string;
  numberOfPlayers: number;
  playersIds: string[];
  playerInTurn: string;
  playerAsPresident: string;
  turnsPlayed: number;
  roundsPlayed: number;
  roundsForNextElections: number;
  governmentPlayers: string[];
  oppositionPlayers: string[];
  deck: Card[];
  approvedLaws: ApprovedLaw[];
  blockedPlayers?: string[];
  cardOnBoard?: Card;

  constructor({
    id,
    numberOfPlayers,
    playersIds,
    playerInTurn,
    playerAsPresident,
    turnsPlayed,
    roundsPlayed,
    roundsForNextElections,
    governmentPlayers,
    oppositionPlayers,
    deck,
    approvedLaws,
    blockedPlayers,
    cardOnBoard
  }: {
    id?: string;
    numberOfPlayers: number;
    playersIds: string[];
    playerInTurn: string;
    playerAsPresident: string;
    turnsPlayed: number;
    roundsPlayed: number;
    roundsForNextElections: number;
    governmentPlayers: string[];
    oppositionPlayers: string[];
    deck: Card[];
    approvedLaws: ApprovedLaw[];
    blockedPlayers?: string[];
    cardOnBoard?: Card;
  }) {
    this.id = id;
    this.numberOfPlayers = numberOfPlayers;
    this.playersIds = playersIds;
    this.playerInTurn = playerInTurn;
    this.playerAsPresident = playerAsPresident;
    this.turnsPlayed = turnsPlayed;
    this.roundsPlayed = roundsPlayed;
    this.roundsForNextElections = roundsForNextElections;
    this.governmentPlayers = governmentPlayers;
    this.oppositionPlayers = oppositionPlayers;
    this.deck = deck;
    this.approvedLaws = approvedLaws;
    this.blockedPlayers = blockedPlayers;
    this.cardOnBoard = cardOnBoard;
  }
}
