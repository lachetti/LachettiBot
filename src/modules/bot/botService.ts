import TelegramBot from 'node-telegram-bot-api';
import { chatsDb } from '../../services/chatsDb';

export default class BotService {
  static getName(chat: TelegramBot.Chat): string {
    return `${chat.first_name || ''} ${chat.last_name || ''}`.trim()
      || chat.username
      || chat.title
      || 'Непонятно Кто';
  }

  static async writeChatToDb(chat: TelegramBot.Chat) {
    const existedChat = await chatsDb.getChatById(chat.id);

    if (!existedChat) {
      chatsDb.addChat(chat);
    }
  }
}