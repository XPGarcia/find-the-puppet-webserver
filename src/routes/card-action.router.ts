import * as express from 'express';
import {
  CorruptionInvestigationAction,
  CoupAction,
  MKUltraAction
} from 'src/constants/card-action.constant';
import { socket } from '../socket';
import { GameService, CardActionService } from '../services';

const router = express.Router();

router.post('/api/card-action/MKUltra', async (req, res) => {
  const { selectedPlayerId } = req.body;

  const cardAction: MKUltraAction = {
    name: 'MKUltra',
    payload: { selectedPlayerId }
  };

  const selectedPlayerRol = CardActionService.mkUltra(cardAction);
  const response = { selectedPlayerId, selectedPlayerRol };

  res.status(200).send({ data: response });
});

router.post('/api/card-action/Coup', async (req, res) => {
  const { playerId } = req.body;

  const cardAction: CoupAction = {
    name: 'Coup',
    payload: { playerId }
  };

  CardActionService.coup(cardAction);
  socket.io.emit('gameStatus', GameService.currentGame);

  res.status(200).send({});
});

router.post('/api/card-action/CorruptionInvestigation', async (req, res) => {
  const { selectedPlayerId } = req.body;

  const cardAction: CorruptionInvestigationAction = {
    name: 'CorruptionInvestigation',
    payload: { selectedPlayerId }
  };

  CardActionService.corruptionInvestigation(cardAction);

  res.status(200).send({});
});

export { router as cardActionRouter };
