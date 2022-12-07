import * as express from 'express';
import { json } from 'body-parser';
import { deckRouter, gameRouter } from './routes';

const app = express();

app.use(json());

app.use(deckRouter);
app.use(gameRouter);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.get('/health/ready', (req, res) => {
  res.send('OK!');
});

export default app;
