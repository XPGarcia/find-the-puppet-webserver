import * as express from 'express';
import { Game } from '../models';
import { GameService } from '../services';
import { GameMapper } from '../mappers';

const router = express.Router();

router.post('/api/game/start', async (req, res) => {
  const { numberOfPlayers, playersIds } = req.body;

  const { deck, playerInTurn, playerAsPresident, governmentPlayers, oppositionPlayers } =
    await GameService.setup(playersIds);

  const game: Game = {
    id: '1',
    numberOfPlayers,
    playersIds,
    playerInTurn,
    playerAsPresident,
    turnsPlayed: 0,
    roundsPlayed: 0,
    roundsForNextElections: 4,
    governmentPlayers,
    oppositionPlayers,
    deck,
    approvedLaws: []
  };

  GameService.setGame({ ...game });

  const response = GameMapper.toResponse(GameService.currentGame);

  res.status(200).send({ data: response });
});

router.post('/api/game/endTurn', async (req, res) => {
  GameService.endTurn();

  const response = GameMapper.toResponse(GameService.currentGame);

  res.status(200).send({ data: response });
});

export { router as gameRouter };
