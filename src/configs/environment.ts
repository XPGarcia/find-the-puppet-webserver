import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environment = {
  env: process.env.APP_ENV ?? 'DEVELOPMENT',
  port: process.env.PORT ?? 3000
};
