import { GameMapper } from '../mappers';
import { WssPartialResponse } from '../dtos';
import { Card, Player, Room, Vote } from '../models';
import { GameService, VotingService } from '../services';

export type VotingEventAction =
  | 'startLawVoting'
  | 'collectVoteForLawVoting'
  | 'startEliminateVoting'
  | 'collectVoteForEliminateVoting'
  | 'startPresidentVoting'
  | 'collectVoteForPresidentVoting';

let playerStartedVoting: Player;

export class VotingEventManager {
  private static startLawVoting(player: Player, card: Card): WssPartialResponse {
    playerStartedVoting = player;
    return {
      responseType: 'voting',
      message: JSON.stringify({ card }),
      communicationType: 'broadcast',
      status: 'LAW_VOTING'
    };
  }

  private static collectVoteForLawVoting(
    room: Room,
    playerId: string,
    vote: Vote,
    cardId: string
  ): WssPartialResponse {
    room.collectVote(playerId, vote);
    const response: WssPartialResponse = {
      responseType: 'voting',
      message: '{}',
      communicationType: 'private',
      status: 'WAITING'
    };
    if (room.votes.length === room.game.players.length) {
      const canApprove = room.countVotes();
      if (canApprove) VotingService.approveLaw(room, playerStartedVoting, cardId);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      delete response.status;
    }
    return response;
  }

  private static startEliminateVoting(): WssPartialResponse {
    return {
      responseType: 'voting',
      message: JSON.stringify({}),
      communicationType: 'broadcast',
      status: 'ELIMINATE_VOTING'
    };
  }

  private static collectVoteForEliminateVoting(
    room: Room,
    playerId: string,
    selectedPlayerId: string
  ): WssPartialResponse {
    room.collectSelectedPlayerVote(playerId, selectedPlayerId);
    const response: WssPartialResponse = {
      responseType: 'voting',
      message: '{}',
      communicationType: 'private',
      status: 'WAITING_VOTING'
    };
    if (room.selectedPlayerVotes.length === room.game.players.length) {
      const selectedPlayer = room.countSelectedPlayerVotes();
      room.game.eliminatePlayer(selectedPlayer);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      response.status = GameService.checkWinConditionByPlayers(room.game);
    }
    return response;
  }

  private static startPresidentVoting(): WssPartialResponse {
    return {
      responseType: 'voting',
      message: JSON.stringify({}),
      communicationType: 'broadcast',
      status: 'PRESIDENT_VOTING'
    };
  }

  private static collectVoteForPresidentVoting(
    room: Room,
    playerId: string,
    selectedPlayerId: string
  ): WssPartialResponse {
    room.collectSelectedPlayerVote(playerId, selectedPlayerId);
    const response: WssPartialResponse = {
      responseType: 'voting',
      message: '{}',
      communicationType: 'private',
      status: 'WAITING_VOTING'
    };
    if (room.selectedPlayerVotes.length === room.game.players.length) {
      const selectedPlayerId = room.countSelectedPlayerVotes();
      room.game.changePresident(selectedPlayerId);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      response.status = GameService.checkWinConditionByLaws(room.game);
    }
    return response;
  }

  static getResponse(room: Room, eventName: VotingEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startLawVoting':
        return this.startLawVoting(payload.player, payload.card);
      case 'collectVoteForLawVoting':
        return this.collectVoteForLawVoting(room, payload.playerId, payload.vote, payload.card);
      case 'startEliminateVoting':
        return this.startEliminateVoting();
      case 'collectVoteForEliminateVoting':
        return this.collectVoteForEliminateVoting(room, payload.playerId, payload.selectedPlayerId);
      case 'startPresidentVoting':
        return this.startPresidentVoting();
      case 'collectVoteForPresidentVoting':
        return this.collectVoteForPresidentVoting(room, payload.playerId, payload.selectedPlayerId);
    }
  }
}
