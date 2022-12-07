import * as express from 'express';
import { DeckService } from '../services';

const router = express.Router();

router.post('/api/cards/draw', async (req, res) => {
  const { playerId, quantity } = req.body;

  const cards = DeckService.draw({ playerId, quantity });

  res.status(200).send({ data: cards });
});

router.post('/api/cards/lookDeck', async (req, res) => {
  const { playerId } = req.body;

  const cards = DeckService.look();

  res.status(200).send({ data: { quantity: cards.length, cards } });
});

export { router as cardsRouter };
