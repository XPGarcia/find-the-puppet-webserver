import { Game } from './game.model';

export class Room {
  id: string;
  hostName: string;
  nextClientId: number;
  clients: { playerId: string; playerName: string }[];
  game: Game;

  constructor({ id, hostName }: { id: string; hostName: string }) {
    this.id = id;
    this.hostName = hostName;
    this.nextClientId = 1;
    this.clients = [];
    this.game = {
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
  }

  newClientJoined(playerName: string) {
    const playerId = this.nextClientId.toString();
    const client = {
      playerId,
      playerName
    };
    this.clients.push(client);
    this.nextClientId++;
    this.nextClientId++;
    return playerId;
  }

  setGame(game: Game) {
    this.game = game;
  }
}
