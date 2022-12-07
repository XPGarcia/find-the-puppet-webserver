import { Card } from '../models';
import { CardRepository } from '../repositories';
import { GameService } from './game.service';

export class DeckService {
  static async new(): Promise<Card[]> {
    const cards = await CardRepository.find();
    return cards.map((cardDoc) => new Card(cardDoc));
  }

  static draw({ quantity = 1 }: { quantity?: number }) {
    const cards = GameService.currentGame.deck;
    const cardsInDeck = cards.filter((card) => card.inDeck);

    const cardsDrawn = cardsInDeck.slice(0, quantity);
    GameService.updateDeckAfterDraw(cardsDrawn);

    return cardsDrawn;
  }

  static drawByIds(cardsIds: string[]) {
    const cards = GameService.currentGame.deck;
    const selectedCards: Card[] = [];

    cardsIds.forEach((cardId) => {
      cards.forEach((card) => {
        if (card.id === cardId) selectedCards.push(card);
      });
    });

    GameService.updateDeckAfterDraw(selectedCards);

    return selectedCards;
  }

  static look() {
    return GameService.currentGame.deck.filter((card) => card.inDeck);
  }
}
