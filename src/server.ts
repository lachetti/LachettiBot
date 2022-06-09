process.env['NTBA_FIX_319'] = '1';

// Поднять сервер
require('./modules/app/app');

// Поднять бота
require('./modules/bot/botController');