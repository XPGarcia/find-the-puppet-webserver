import { GameMapper } from '../mappers';
import { WssPartialResponse } from '../dtos';
import { Card, Room, Vote } from '../models';
import { GameService, VotingService } from '../services';

export type VotingEventAction =
  | 'startLawVoting'
  | 'collectVoteForLawVoting'
  | 'startEliminateVoting'
  | 'collectVoteForEliminateVoting';

let playerStartedVoting = '';

export class VotingEventManager {
  private static startLawVoting(playerId: string, card: Card): WssPartialResponse {
    playerStartedVoting = playerId;
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
    room.collectEliminateVote(playerId, selectedPlayerId);
    const response: WssPartialResponse = {
      responseType: 'voting',
      message: '{}',
      communicationType: 'private',
      status: 'WAITING_VOTING'
    };
    console.log(room.game.players.length);
    if (room.eliminateVotes.length === room.game.players.length) {
      const eliminatedPlayer = room.countEliminateVotes();
      room.game.eliminatePlayer(eliminatedPlayer);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      response.status = GameService.checkWinConditionByPlayers(room.game);
      console.log(response.status);
    }
    return response;
  }

  static getResponse(room: Room, eventName: VotingEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startLawVoting':
        return this.startLawVoting(payload.playerId, payload.card);
      case 'collectVoteForLawVoting':
        return this.collectVoteForLawVoting(room, payload.playerId, payload.vote, payload.card);
      case 'startEliminateVoting':
        return this.startEliminateVoting();
      case 'collectVoteForEliminateVoting':
        return this.collectVoteForEliminateVoting(room, payload.playerId, payload.selectedPlayerId);
    }
  }
}
