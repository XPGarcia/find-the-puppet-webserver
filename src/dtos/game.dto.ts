import { ApprovedLaw, Card } from 'src/models';

export interface GameResponse {
  id: string;
  numberOfPlayers: number;
  playerInTurn: string;
  playerAsPresident: string;
  turnsPlayed: number;
  roundsPlayed: number;
  roundsForNextElections: number;
  approvedLaws: ApprovedLaw[];
  governmentPlayers: string[];
  oppositionPlayers: string[];
  cardOnBoard?: Card;
}
