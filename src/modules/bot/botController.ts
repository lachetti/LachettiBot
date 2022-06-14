import { config } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import BotService from './botService';
import DiscogsScrapper from '../../services/discogsScrapper';

config();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Init and export singleton of the TelegramBot
export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

if (bot) {
  bot.getMe()
    .then((me) => {
      console.log('\x1b[34m', `Telegram @${me.username} running`, '\x1b[0m');
    });
}

bot.onText(/(?:иди|пошёл|вали|пиздуй|уёбывай|съеби|уйди|ди) нахуй/i, (msg, match) => {
  const chatId = msg.chat.id;
  const name = BotService.getName(msg.chat);

  console.log(name, 'послал нас нахуй в чате', chatId);
  bot.sendMessage(chatId, `Чё? Сам ${match}, ${name}`);
});

bot.onText(/\/albums (.*)/, (msg, match) => {
  if (match[1]) {
    DiscogsScrapper.getAlbums(match[1])
      .then(result => {
        result.forEach(albumImgUrl => {
          bot.sendPhoto(msg.chat.id, albumImgUrl)
            .catch(e => console.error(e.message));
        });
      })
      .catch(error => console.error(error));
  }
});

bot.on('message', async (msg) => {
  if (msg.chat) {
    BotService.writeChatToDb(msg.chat);
  }
});