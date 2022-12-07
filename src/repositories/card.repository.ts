import mongoose from 'mongoose';
import { Card, CardType } from '../models';

interface CardModel extends mongoose.Model<CardDoc> {
  build(card: Card): CardDoc;
}

export interface CardDoc extends mongoose.Document {
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
cardSchema.statics.build = (card: Card) => new CardRepository(card);

export const CardRepository = mongoose.model<CardDoc, CardModel>('Card', cardSchema);
