import * as dotenv from 'dotenv';
import * as path from 'path';
import * as wss from './wss';
import mongoose from 'mongoose';
import { MongoUri } from './database/config';

dotenv.config({ path: path.join(__dirname, '../.env') });

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MongoUri);

    console.log('DB connected!');
  } catch (error) {
    console.log(error);
  }

  wss.start();
};

start();
