const TelegramBot = require('node-telegram-bot-api');

// Menggunakan token dari environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;

// Membuat instance bot dengan polling enabled untuk development
const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error.message}`);
});

module.exports = bot;