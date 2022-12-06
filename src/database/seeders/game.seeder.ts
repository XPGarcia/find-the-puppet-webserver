import mongoose from 'mongoose';
import { environment } from '../../configs';
import { Card } from '../../models';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const mongoUri = `mongodb://${environment.mongoose.user}:${environment.mongoose.password}@database`;

const cards = [];

const seed = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);

    const cardsPending = cards.map(async (card) => await card.save());
    await Promise.all(cardsPending);

    await mongoose.disconnect();
    console.log('Card Seeders Done!');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseCard = (row: any) => {
  const quickPlay = row[3].trim().toLowerCase() === 'true' ? true : false;
  const card = Card.build({
    type: row[0].trim().toLowerCase(),
    title: row[1].trim(),
    body: row[2].trim(),
    quickPlay
  });
  cards.push(card);
};

fs.createReadStream('assets/data/cards.csv')
  .pipe(parse({ delimiter: ';', from_line: 2 }))
  .on('data', parseCard)
  .on('end', seed)
  .on('error', function (error) {
    console.log(error.message);
  });
