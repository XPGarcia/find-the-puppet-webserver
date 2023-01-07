import * as dotenv from 'dotenv';
import * as path from 'path';
import * as wss from './wss';

dotenv.config({ path: path.join(__dirname, '../.env') });

const start = () => {
  wss.start();
};

start();
