import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environment = {
  port: process.env.PORT ?? 3000,
  certificatePath: process.env.SSL_CERT_PATH ?? 'src/certificate.crt',
  keyPath: process.env.SSL_KEY_PATH ?? 'src/private.key'
};
