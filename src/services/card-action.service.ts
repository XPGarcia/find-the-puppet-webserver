import {
  CardAction,
  CorruptionInvestigationAction,
  CoupAction,
  MKUltraAction
} from '../constants/card-action.constant';
import { GameService } from './game.service';

export class CardActionService {
  static execute(cardAction: CardAction) {
    switch (cardAction.name) {
      case 'MKUltra':
        this.mkUltra(cardAction);
    }
  }

  static mkUltra(cardAction: MKUltraAction) {
    const governmentPlayer = GameService.currentGame.governmentPlayers.find(
      (playerId) => playerId === cardAction.payload.selectedPlayerId
    );

    return governmentPlayer ? 'government' : 'opposition';
  }

  static coup(cardAction: CoupAction) {
    const playerId = cardAction.payload.playerId;
    GameService.setGame({ playerAsPresident: playerId });
  }

  static corruptionInvestigation(cardAction: CorruptionInvestigationAction) {
    const selectedPlayerId = cardAction.payload.selectedPlayerId;
    const blockedPlayers = [...GameService.currentGame.blockedPlayers];
    blockedPlayers.push(selectedPlayerId);
    GameService.setGame({ blockedPlayers });
  }
}
