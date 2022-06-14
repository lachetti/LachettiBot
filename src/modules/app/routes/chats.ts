import { Router } from 'express';
import { chatsDb } from '../../../services/chatsDb';

const chats = Router();

chats.get('/getChats', async (req, res) => {
  const result = await chatsDb.getChatsByParams({});

  res.send(result);
});

export default chats;