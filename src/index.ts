import app from './app';
import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';
import { environment } from './configs';
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

  app.listen(environment.port);
};

start();
