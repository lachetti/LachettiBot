import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import routes from './routes/routes';
import chats from './routes/chats';
import index from './routes/index';

// Parse .env file and write to process.env
config();
const PORT = process.env.PORT;

// run express server
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(
    '\x1b[33m%s\x1b[0m', `[${new Date().toTimeString().match(/\d+:\d+:\d+/)[0]}]`,
    '\x1b[32m', `${req.method} ${req.protocol}://${req.hostname}:${PORT}${req.path}`,
    '\x1b[0m'
  );
  next();
});

app.use(routes.chats, chats);
app.use(routes.index, index);

app.listen(PORT, () => {
  console.log('\x1b[36m', `Server running on ${PORT}`, '\x1b[0m');
});