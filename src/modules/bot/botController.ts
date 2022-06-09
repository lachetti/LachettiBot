import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import BotService from './botService';

config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Init and export singleton of the TelegramBot
export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

if (bot.isPolling()) {
  console.log('Bot is polling');
}

bot.onText(/(?:иди|пошёл|вали|пиздуй|уёбывай|съеби|уйди|ди) нахуй/i, (msg, match) => {
  const chatId = msg.chat.id;
  const name = BotService.getName(msg.chat);

  console.log(name, 'послал нас нахуй в чате', chatId);
  bot.sendMessage(chatId, `Чё? Сам ${match}, ${name}`);
});

bot.on('message', async (msg) => {
  if (msg.chat) {
    BotService.writeChatToDb(msg.chat);
  }
});