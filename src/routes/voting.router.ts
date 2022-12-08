import * as express from 'express';
import { GameService } from '../services';
import { GameMapper } from '../mappers';

const router = express.Router();

router.post('/api/voting/execute', async (req, res) => {
  const { type, params } = req.body;

  const response = GameMapper.toResponse(GameService.currentGame);

  res.status(200).send({ data: response });
});

export { router as votingRouter };
