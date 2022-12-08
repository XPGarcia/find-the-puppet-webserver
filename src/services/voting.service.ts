import { ApprovedLaw } from '../models';
import { VotingOptions } from '../models';
import { GameService } from './game.service';

export class VotingService {
  static execute(options: VotingOptions) {
    switch (options.type) {
      case 'approveLaw':
        this.approveLaw(options.params.playerId, options.params.cardId);
        break;
      case 'presidentElection':
        this.presidentElection(options.params.playerId);
        break;
    }
  }

  static approveLaw(playerId: string, cardId: string) {
    const approvedLaw = new ApprovedLaw({ playerId, cardId });
    const approvedLaws = GameService.currentGame.approvedLaws;
    approvedLaws.push(approvedLaw);
    GameService.setGame({ approvedLaws });
  }

  static presidentElection(playerId: string) {
    const playerAsPresident = playerId;
    GameService.setGame({ playerAsPresident });
  }
}
