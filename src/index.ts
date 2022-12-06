import app from './app';
import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';
import { environment } from './configs';

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = `mongodb://${environment.mongoose.user}:${environment.mongoose.password}@database`;

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.log(error);
  }

  app.listen(environment.port);
};

start();
