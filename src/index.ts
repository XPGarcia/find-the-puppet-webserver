import app from './app';
import { createServer } from 'http';
import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';
import { environment } from './configs';
import { MongoUri } from './database/config';
import * as socket from './socket';

dotenv.config({ path: path.join(__dirname, '../.env') });

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MongoUri);

    console.log('DB connected!');
  } catch (error) {
    console.log(error);
  }

  const httpServer = createServer(app);
  socket.connect(httpServer);
  httpServer.listen(3000);

  app.listen(environment.port);
};

start();
