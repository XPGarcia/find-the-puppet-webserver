import * as express from 'express';
import { DeckService } from '../services';

const router = express.Router();

router.post('/api/deck/draw', async (req, res) => {
  const { playerId, quantity } = req.body;

  const cards = DeckService.draw({ playerId, quantity });

  res.status(200).send({ data: cards });
});

router.post('/api/deck/drawByIds', async (req, res) => {
  const { playerId, cardsIds } = req.body;

  const cards = DeckService.drawByIds({ playerId, cardsIds });

  res.status(200).send({ data: cards });
});

router.post('/api/deck/look', async (req, res) => {
  const deck = DeckService.look();

  res.status(200).send({ data: { quantity: deck.length, cards: deck } });
});

export { router as deckRouter };
