/**
 * Membuat keyboard mood untuk rekomendasi film
 * @returns {Object} - Objek keyboard untuk Telegram
 */
function createMoodKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['😊 Senang', '😢 Sedih', '😰 Tegang'],
        ['💪 Semangat', '😴 Bosan', '💞 Romantis'],
        ['😱 Takut', '🧐 Penasaran'],
        ['❌ Batalkan']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
}

/**
 * Membuat inline keyboard untuk navigasi hasil pencarian
 * @param {number} currentPage - Halaman saat ini
 * @param {number} totalPages - Total halaman hasil
 * @param {string} queryId - ID query pencarian
 * @returns {Object} - Objek inline keyboard untuk Telegram
 */
function createPaginationKeyboard(currentPage, totalPages, queryId) {
  const keyboard = [];
  const buttons = [];
  
  // Tombol Previous jika bukan halaman pertama
  if (currentPage > 1) {
    buttons.push({
      text: '◀️ Sebelumnya',
      callback_data: `page_${queryId}_${currentPage - 1}`
    });
  }
  
  // Tombol Next jika bukan halaman terakhir
  if (currentPage < totalPages) {
    buttons.push({
      text: 'Selanjutnya ▶️',
      callback_data: `page_${queryId}_${currentPage + 1}`
    });
  }
  
  // Tambahkan tombol ke keyboard jika ada
  if (buttons.length > 0) {
    keyboard.push(buttons);
  }
  
  return {
    reply_markup: {
      inline_keyboard: keyboard
    }
  };
}

/**
 * Keyboard untuk kembali ke menu utama
 * @returns {Object} - Objek keyboard untuk Telegram
 */
function createBackToMenuKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['🔍 Cari Film', '🎭 Rekomendasi Mood'],
        ['ℹ️ Bantuan']
      ],
      resize_keyboard: true
    }
  };
}

module.exports = {
  createMoodKeyboard,
  createPaginationKeyboard,
  createBackToMenuKeyboard
};