import * as express from 'express';
import { CardMapper } from '../mappers';
import { DeckService } from '../services';

const router = express.Router();

router.post('/api/deck/draw', async (req, res) => {
  const { quantity } = req.body;

  const cards = DeckService.draw({ quantity });

  const response = CardMapper.toResponses(cards);

  res.status(200).send({ data: response });
});

router.post('/api/deck/drawByIds', async (req, res) => {
  const { cardsIds } = req.body;

  const cards = DeckService.drawByIds(cardsIds);

  res.status(200).send({ data: cards });
});

router.post('/api/deck/look', async (req, res) => {
  const deck = DeckService.look();

  res.status(200).send({ data: { quantity: deck.length, cards: deck } });
});

export { router as deckRouter };
