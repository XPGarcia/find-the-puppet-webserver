import { GameMapper } from '../mappers';
import { WssPartialResponse } from '../dtos';
import { Card, Room, Vote } from '../models';
import { VotingService } from '../services';

export type VotingEventAction = 'startLawVoting' | 'collectVoteForLawVoting';

let playerStartedVoting = '';

export class VotingEventManager {
  private static startLawVoting(playerId: string, card: Card): WssPartialResponse {
    playerStartedVoting = playerId;
    return {
      responseType: 'voting',
      message: JSON.stringify({ card }),
      communicationType: 'broadcast',
      status: 'VOTING'
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
    if (room.votes.length === room.clients.length) {
      const canApprove = room.countVotes();
      if (canApprove) VotingService.approveLaw(room, playerStartedVoting, cardId);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      delete response.status;
    }
    return response;
  }

  static getResponse(room: Room, eventName: VotingEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startLawVoting':
        return this.startLawVoting(payload.playerId, payload.card);
      case 'collectVoteForLawVoting':
        return this.collectVoteForLawVoting(room, payload.playerId, payload.vote, payload.card);
    }
  }
}
