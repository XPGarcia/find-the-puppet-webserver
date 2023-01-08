import { shuffle } from '../utils';
import { Game } from './game.model';
import { Vote } from './voting.model';

export class Room {
  id: string;
  hostName: string;
  nextClientId: number;
  clients: { playerId: string; playerName: string; playerProfile: string }[];
  game: Game;
  profiles = [
    'capitalist_pig.png',
    'anarchist_cat.png',
    'communist_monkey.png',
    'priest_fox.png',
    'capitalist_pig_2.png'
  ];
  votes: { playerId: string; vote: Vote }[];

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
    this.votes = [];
  }

  newClientJoined(playerName: string) {
    const playerId = this.nextClientId.toString();
    const client = {
      playerId,
      playerName,
      playerProfile: ''
    };
    this.clients.push(client);
    this.nextClientId++;
    return playerId;
  }

  removeClient(playerId: string) {
    const client = this.clients.find((client) => client.playerId === playerId);
    this.profiles.push(client.playerProfile);
    this.clients = this.clients.filter((c) => c.playerId !== client.playerId);
  }

  setClientProfile(playerId: string, playerProfile: string) {
    this.clients.forEach((client) => {
      if (client.playerId === playerId) client.playerProfile = playerProfile;
    });
  }

  getClientProfile(playerId: string) {
    return this.clients.find((client) => client.playerId === playerId).playerProfile;
  }

  getNewRandomProfile() {
    const profile = shuffle(this.profiles)[0];
    this.profiles = this.profiles.filter((p) => p !== profile);
    return profile;
  }

  collectVote(playerId: string, vote: Vote) {
    this.votes.push({ playerId, vote });
  }

  countVotes(): boolean {
    let yes = 0;
    let no = 0;
    this.votes.forEach((vote) => {
      if (vote.vote === 'YES') yes++;
      else if (vote.vote === 'NO') no++;
    });
    this.votes = [];
    return yes >= no;
  }

  setGame(game: Game) {
    this.game = game;
  }
}
