import { Room } from 'src/models/room.model';
import {
  CardAction,
  CorruptionInvestigationAction,
  CoupAction,
  MKUltraAction
} from '../constants/card-action.constant';
import { GameService } from './game.service';

export class CardActionService {
  static execute(room: Room, cardAction: CardAction) {
    switch (cardAction.name) {
      case 'MKUltra':
        this.mkUltra(room, cardAction);
    }
  }

  static mkUltra(room: Room, cardAction: MKUltraAction) {
    const governmentPlayer = room.game.governmentPlayers.find(
      (playerId) => playerId === cardAction.payload.selectedPlayerId
    );

    return governmentPlayer ? 'government' : 'opposition';
  }

  static coup(room: Room, cardAction: CoupAction) {
    const playerId = cardAction.payload.playerId;
    GameService.setGame(room, { playerAsPresident: playerId });
  }

  static corruptionInvestigation(room: Room, cardAction: CorruptionInvestigationAction) {
    const selectedPlayerId = cardAction.payload.selectedPlayerId;
    const blockedPlayers = [...room.game.blockedPlayers];
    blockedPlayers.push(selectedPlayerId);
    GameService.setGame(room, { blockedPlayers });
  }
}
