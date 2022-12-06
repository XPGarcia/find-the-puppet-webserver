import mongoose from 'mongoose';
import { Card, CardType } from '../types';

interface CardModel extends mongoose.Model<CardDoc> {
  build(card: Card): CardDoc;
}

interface CardDoc extends mongoose.Document {
  type: CardType;
  title?: string;
  body: string;
  quickPlay: boolean;
}

const cardSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  body: {
    type: String,
    required: true
  },
  quickPlay: {
    type: Boolean,
    required: true
  }
});
cardSchema.statics.build = (card: Card) => new Card(card);

const Card = mongoose.model<CardDoc, CardModel>('Card', cardSchema);

export { Card };
