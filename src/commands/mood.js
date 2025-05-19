const { getMoviesByMood } = require('../services/tmdb');
const { formatMoodRecommendation } = require('../utils/formatter');
const { createMoodKeyboard, createBackToMenuKeyboard } = require('../utils/keyboard');

/**
 * Handler untuk command /mood
 * @param {Object} bot - Instance bot Telegram
 */
function moodCommand(bot) {
  // Menangani perintah /mood
  bot.onText(/\/mood|🎭 Rekomendasi Mood/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(
      chatId, 
      `Pilih mood Anda, dan saya akan merekomendasikan film yang cocok:`,
      createMoodKeyboard()
    );
  });
  
  // Menangani pemilihan mood
  const moodRegex = /(😊 Senang|😢 Sedih|😰 Tegang|💪 Semangat|😴 Bosan|💞 Romantis|😱 Takut|🧐 Penasaran)/;
  bot.onText(moodRegex, async (msg) => {
    const chatId = msg.chat.id;
    const fullMoodText = msg.text;
    // Ekstrak mood dari emoji
    const mood = fullMoodText.replace(/[^\p{L}\s]/gu, '').trim();
    
    try {
      // Mengirim pesan loading
      const loadingMsgId = await bot.sendMessage(
        chatId, 
        `🔍 Mencari rekomendasi film untuk mood "${mood}"...`
      );
      
      // Dapatkan rekomendasi film berdasarkan mood
      const movieRecommendations = await getMoviesByMood(mood);
      
      // Hapus pesan loading
      bot.deleteMessage(chatId, loadingMsgId.message_id);
      
      // Format dan kirim rekomendasi
      const messageText = formatMoodRecommendation(mood, movieRecommendations.results);
      
      bot.sendMessage(chatId, messageText, {
        parse_mode: 'HTML',
        ...createBackToMenuKeyboard()
      });
    } catch (error) {
      console.error('Error mendapatkan rekomendasi film:', error);
      bot.sendMessage(
        chatId, 
        'Maaf, terjadi kesalahan saat mendapatkan rekomendasi film. Silakan coba lagi nanti.',
        createBackToMenuKeyboard()
      );
    }
  });
  
  // Menangani batal mood
  bot.onText(/❌ Batalkan/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(
      chatId, 
      'Pencarian mood dibatalkan. Silakan pilih opsi lain:',
      createBackToMenuKeyboard()
    );
  });
}

module.exports = moodCommand;