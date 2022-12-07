import * as express from 'express';
import { random, shuffle } from '../utils';
import { Game, CardInGame } from '../types';
import { DeckService, GameService } from '../services';

const router = express.Router();

router.post('/api/game/start', async (req, res) => {
  const { numberOfPlayers, playersIds } = req.body;

  const deck = await DeckService.newDeck();

  const gpOne = random<string>(playersIds);
  const gpTwo = random<string>(playersIds.filter((id) => id !== gpOne));
  const governmentPlayers = [gpOne, gpTwo];

  const oppositionPlayers = playersIds.filter((id) => id !== gpOne && id !== gpTwo);

  const playerAsPresident = random<string>(playersIds);

  const presidentIndex = (playersIds as string[]).findIndex(
    (playerId) => playerId === playerAsPresident
  );

  const firstPlayerIndex = presidentIndex + 1 === playersIds.length ? 0 : presidentIndex + 1;
  const playerInTurn = playersIds[firstPlayerIndex];

  const game: Game = {
    id: '1',
    numberOfPlayers,
    playerInTurn,
    playerAsPresident,
    turnsPlayed: 0,
    roundsPlayed: 0,
    governmentPlayers,
    oppositionPlayers,
    deck: shuffle<CardInGame>(deck)
  };

  GameService.setGame(game);

  res.status(200).send({ data: GameService.currentGame });
});

export { router as gameRouter };
