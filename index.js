require('dotenv').config();
const bot = require('./src/bot');

// Mengimpor semua command handlers
const startCommand = require('./src/commands/start');
const helpCommand = require('./src/commands/help');
const searchCommand = require('./src/commands/search');
const moodCommand = require('./src/commands/mood');

// Mendaftarkan command handlers
startCommand(bot);
helpCommand(bot);
searchCommand(bot);
moodCommand(bot);

console.log('Bot Telegram pencari film sedang berjalan...');