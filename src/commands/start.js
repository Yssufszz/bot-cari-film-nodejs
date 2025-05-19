const { createBackToMenuKeyboard } = require('../utils/keyboard');

/**
 * Handler untuk command /start
 * @param {Object} bot - Instance bot Telegram
 */
function startCommand(bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    
    const welcomeMessage = `
Halo ${firstName}! 👋

Selamat datang di <b>Movie Search Bot</b>! 🎬

Bot ini dapat membantu Anda:
• Mencari film berdasarkan judul
• Mendapatkan rekomendasi film sesuai mood Anda

Silakan gunakan menu di bawah atau ketik:
/search - untuk mencari film
/mood - untuk rekomendasi berdasarkan mood
/help - untuk bantuan lebih lanjut
    `;
    
    bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'HTML',
      ...createBackToMenuKeyboard()
    });
  });
  
  // Untuk tombol "🔍 Cari Film"
  bot.onText(/🔍 Cari Film/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId, 
      'Silakan ketik judul film yang ingin Anda cari:',
      { reply_markup: { force_reply: true } }
    );
  });
  
  // Untuk tombol "ℹ️ Bantuan"
  bot.onText(/ℹ️ Bantuan/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId, 
      '/help - Menampilkan bantuan',
      { parse_mode: 'HTML' }
    );
  });
}

module.exports = startCommand;