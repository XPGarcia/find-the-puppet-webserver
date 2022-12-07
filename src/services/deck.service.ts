import { Card, CardInGame } from '../types';
import { CardModel } from '../models';
import { GameService } from './game.service';

export class DeckService {
  static async new(): Promise<CardInGame[]> {
    const cards = await CardModel.find();
    return cards.map((cardDoc) => new CardInGame({ card: new Card(cardDoc) }));
  }

  static draw({ playerId, quantity = 1 }: { playerId: string; quantity?: number }) {
    const cards = GameService.currentGame.deck;
    const cardsInDeck = cards.filter((card) => card.inDeck && !card.playerId);

    const cardsDrawn = cardsInDeck.slice(0, quantity);
    GameService.updateDeckAfterDraw(playerId, cardsDrawn);

    return cardsDrawn.map((cardInGame) => new Card(cardInGame.card));
  }

  static drawByIds({ playerId, cardsIds }: { playerId: string; cardsIds: string[] }) {
    const cards = GameService.currentGame.deck;
    const selectedCards: CardInGame[] = [];

    cardsIds.forEach((cardId) => {
      cards.forEach((cardInGame) => {
        if (cardInGame.card.id === cardId) selectedCards.push(cardInGame);
      });
    });

    GameService.updateDeckAfterDraw(playerId, selectedCards);

    return selectedCards.map((cardInGame) => new Card(cardInGame.card));
  }

  static look() {
    return GameService.currentGame.deck
      .filter((card) => card.inDeck)
      .map((cardInGame) => new Card(cardInGame.card));
  }
}
