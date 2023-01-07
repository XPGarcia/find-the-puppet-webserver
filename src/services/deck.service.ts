import { Card, Game } from '../models';
import { GameService } from './game.service';
import * as fs from 'fs';

export class DeckService {
  static new(): Card[] {
    const cards = JSON.parse(fs.readFileSync('assets/data/cards.json', 'utf8'));
    return cards.map((cardDoc) => new Card(cardDoc));
  }

  static draw({ game, quantity = 1 }: { game: Game; quantity?: number }) {
    const cards = game.deck;
    const cardsInDeck = cards.filter((card) => card.inDeck);

    const cardsDrawn = cardsInDeck.slice(0, quantity);
    GameService.updateDeckAfterDraw(game, cardsDrawn);

    return cardsDrawn;
  }

  static drawByIds(game: Game, cardsIds: string[]) {
    const cards = game.deck;
    const selectedCards: Card[] = [];

    cardsIds.forEach((cardId) => {
      cards.forEach((card) => {
        if (card.id === cardId) selectedCards.push(card);
      });
    });

    GameService.updateDeckAfterDraw(game, selectedCards);

    return selectedCards;
  }

  static look(game: Game) {
    return game.deck.filter((card) => card.inDeck);
  }
}
