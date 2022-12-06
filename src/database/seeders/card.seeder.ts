import mongoose from 'mongoose';
import { environment } from '../../configs';
import { Card } from '../../models';

const cards = [
  Card.build({ type: 'law', body: 'Law 1', quickPlay: false }),
  Card.build({ type: 'action', body: 'Action 1', quickPlay: false }),
  Card.build({ type: 'action', body: 'Action 2', quickPlay: true })
];

const mongoUri = `mongodb://${environment.mongoose.user}:${environment.mongoose.password}@database`;

const seed = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);

    const cardsPending = cards.map(async (card) => await card.save());
    Promise.all(cardsPending);
    console.log('Card Seeders Done!');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
};

seed();
