const { createBackToMenuKeyboard } = require('../utils/keyboard');

/**
 * Handler untuk command /help
 * @param {Object} bot - Instance bot Telegram
 */
function helpCommand(bot) {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
<b>🎬 Panduan Movie Search Bot</b>

<b>Perintah yang tersedia:</b>
• /start - Memulai bot
• /search - Mencari film berdasarkan judul
• /mood - Rekomendasi film berdasarkan mood
• /help - Menampilkan bantuan ini

<b>Cara menggunakan:</b>

1. <b>Mencari Film</b>
   - Ketik /search atau pilih "🔍 Cari Film"
   - Masukkan judul film yang ingin dicari
   - Bot akan menampilkan hasil pencarian
   - Pilih film untuk melihat detail

2. <b>Rekomendasi berdasarkan Mood</b>
   - Ketik /mood atau pilih "🎭 Rekomendasi Mood"
   - Pilih mood Anda dari keyboard
   - Bot akan menampilkan film yang sesuai dengan mood

3. <b>Melihat Detail Film</b>
   - Pilih film dari hasil pencarian
   - Gunakan tombol yang tersedia untuk:
     • Melihat detail film
     • Mencari film serupa

<b>Tips:</b> Anda juga bisa langsung mengetik /info_[id_film] untuk melihat detail film tertentu.

Selamat menikmati! 🍿
    `;
    
    bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'HTML',
      ...createBackToMenuKeyboard()
    });
  });
}

module.exports = helpCommand;