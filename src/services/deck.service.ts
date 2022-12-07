import { CardInGame } from '../types';
import { CardModel } from '../models';
import { GameService } from './game.service';

export class DeckService {
  static async newDeck(): Promise<CardInGame[]> {
    const cards = await CardModel.find();
    return cards.map((cardDoc) => new CardInGame({ cardId: cardDoc._id }));
  }

  static draw({ playerId, quantity = 1 }: { playerId: string; quantity?: number }) {
    const cards = GameService.currentGame.deck;
    const cardsInDeck = cards.filter((card) => card.inDeck && !card.playerId);

    const cardsDrawn = cardsInDeck.slice(0, quantity);

    GameService.currentGame.deck.forEach((cardInDeck) => {
      cardsDrawn.forEach((cardDrawn) => {
        if (cardInDeck === cardDrawn) {
          cardInDeck.inDeck = false;
          cardInDeck.playerId = playerId;
        }
      });
    });

    return cardsDrawn;
  }

  static look() {
    return GameService.currentGame.deck.filter((card) => card.inDeck);
  }
}
