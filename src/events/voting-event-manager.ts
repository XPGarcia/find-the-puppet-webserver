import { GameMapper } from '../mappers';
import { WssPartialResponse } from '../dtos';
import { Card, Room, Vote } from '../models';
import { VotingService } from '../services';

export type VotingEventAction = 'startLawVoting' | 'collectVoteForLawVoting';

export class VotingEventManager {
  private static startLawVoting(card: Card): WssPartialResponse {
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
    card: Card
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
      if (canApprove) VotingService.approveLaw(room, playerId, card);
      response.message = JSON.stringify({ game: GameMapper.toResponse(room.game) });
      response.communicationType = 'broadcast';
      delete response.status;
    }
    return response;
  }

  static getResponse(room: Room, eventName: VotingEventAction, payload?: any): WssPartialResponse {
    switch (eventName) {
      case 'startLawVoting':
        return this.startLawVoting(payload.card);
      case 'collectVoteForLawVoting':
        return this.collectVoteForLawVoting(room, payload.playerId, payload.vote, payload.card);
    }
  }
}
