import TelegramBot from 'node-telegram-bot-api';
import * as SQLite3 from 'sqlite3';

const sqlite3 = SQLite3.verbose();
const fileDump = './telegram-bot-db.sqlite3';

export interface IChatName {
  id?: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface IChatInfo {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  invite_link?: string;
  linked_chat_id?: number;
}

class ChatsDb {
  private maxTry = 4;
  private attemptWrite = 0;
  private tableName = 'chats';
  private columns = [
    { name: 'id',             type: 'INT'  },
    { name: 'type',           type: 'TEXT' },
    { name: 'title',          type: 'TEXT' },
    { name: 'username',       type: 'TEXT' },
    { name: 'first_name',     type: 'TEXT' },
    { name: 'last_name',      type: 'TEXT' },
    { name: 'description',    type: 'TEXT' },
    { name: 'invite_link',    type: 'TEXT' },
    { name: 'linked_chat_id', type: 'INT'  },
  ];

  constructor() {
    const sqlCreateTable = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${this.columns.map(col => `${col.name} ${col.type}`).join(', ')});`;

    // Create table if not exist
    this.runOnDb((db: SQLite3.Database) => {
      db.run(sqlCreateTable, (err) => {
        if (err) {
          console.error(err);
        }

        console.log('\x1b[36m', 'Connected to sqlite3 DB', '\x1b[0m');
      });

      // https://www.sqlite.org/wal.html
      db.run('PRAGMA journal_mode=wal;');
    });
  }

  private runOnDb(callback: (db: SQLite3.Database) => void) {
    const db = new sqlite3.Database(fileDump, (err) => {
      if (err) {
        console.error(err.message);
      }

      db.serialize(() => {
        callback(db);
        db.close();
      });
    });
  }

  private async getRow(sql: string) {
    return new Promise<IChatInfo | null>((resolve) => {
      this.runOnDb((db) => {
        db.get(sql, (err, row) => {
          if (err) {
            console.error(err.message);
          }

          resolve(row || null);
        });
      });
    });
  }

  private async allRows(sql: string) {
    return new Promise<IChatInfo[] | null>((resolve) => {
      this.runOnDb((db) => {
        db.all(sql, (err, rows) => {
          if (err) {
            console.error(err.message);
          }

          resolve(rows.length ? rows : []);
        });
      });
    });
  }

  private async run(sql: string) {
    return new Promise<null>((resolve, reject) => {
      this.runOnDb((db) => {
        db.prepare(sql)
          .run((err) => {
            if (!err) {
              resolve(null);
            } else {
              console.error('SQLite3 Error:', err.message);
              reject(err);
            }
          })
          .finalize((err) => {
            if (err) {
              console.error('SQLite3 Error:', err.message);
            }
          });
      });
    });
  }

  async getChatsByParams(params: IChatName) {
    const whereString = Object.entries(params)
      .map(([key, value]) => `${key} = ${value}`)
      .join(' AND ');

    const sql = `SELECT * FROM ${ this.tableName }${ whereString ? ' WHERE ' + whereString : '' };`;

    return await this.allRows(sql);
  }

  async getChatById(id: number) {
    const sql = `SELECT * FROM ${ this.tableName } WHERE id = ${ id };`;

    return await this.getRow(sql);
  }

  async getChatsByType(type: TelegramBot.ChatType) {
    const sql = `SELECT * FROM ${ this.tableName } WHERE type = ${ type };`;

    return await this.allRows(sql);
  }

  addChat(chat: TelegramBot.Chat): void {
    if (!Object.values(chat).length) {
      return;
    }

    const values: IChatInfo = {
      id: chat.id,
      type: chat.type,
      title: chat.title,
      username: chat.username,
      first_name: chat.first_name,
      last_name: chat.last_name,
      description: chat.description,
      invite_link: chat.invite_link,
      linked_chat_id: chat.linked_chat_id,
    };

    const columnsString = Object.entries(values).filter(([, value]) => !!value).map(([key]) => key).join(', ');
    const valuesString = Object.values(values)
      .filter(Boolean)
      .map(value => typeof value === 'string' ? `'${value}'` : value)
      .join(', ');

    const sql = `INSERT INTO ${ this.tableName } (${ columnsString }) VALUES (${ valuesString })`;

    this.run(sql)
      .then(() => {
        this.attemptWrite = 0;
        console.error('Chat', chat.id, 'has succesfuly written to DB');
      })
      .catch((err) => {
        if (err.code === 'SQLITE_BUSY') {
          this.attemptWrite++;

          if (this.attemptWrite <= this.maxTry) {
            setTimeout(() => {
              this.addChat(chat);
            }, 2000);
          } else {
            console.error(`Chat ${chat.id} was not saved. DB was busy.`);
          }
        }
      });
  }
}

export const chatsDb = new ChatsDb();