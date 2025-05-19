/**
 * Format hasil pencarian film untuk pesan Telegram
 * @param {Object} movie - Data film
 * @param {Function} getPosterUrl - Fungsi untuk mendapatkan URL poster
 * @returns {Object} - Objek yang berisi pesan dan opsi pesan
 */
function formatMovieResult(movie, getPosterUrl) {
  // Format tanggal rilis (jika ada)
  const releaseDate = movie.release_date 
    ? `\nTanggal Rilis: ${new Date(movie.release_date).toLocaleDateString('id-ID')}` 
    : '';
  
  // Format rating
  const rating = movie.vote_average 
    ? `\nRating: ⭐ ${movie.vote_average.toFixed(1)}/10 (${movie.vote_count} votes)` 
    : '\nRating: Belum ada rating';
  
  // Format overview/sinopsis
  const overview = movie.overview 
    ? `\n\n<b>Sinopsis:</b>\n${movie.overview}` 
    : '\n\nSinopsis tidak tersedia.';
  
  // Buat pesan lengkap
  const message = `<b>🎬 ${movie.title}</b>${movie.original_title !== movie.title ? ` (${movie.original_title})` : ''}${releaseDate}${rating}${overview}`;
  
  // Opsi pesan (termasuk foto jika ada)
  const options = {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Detail Film',
            callback_data: `detail_${movie.id}`
          },
          {
            text: 'Film Serupa',
            callback_data: `similar_${movie.id}`
          }
        ]
      ]
    }
  };
  
  // Jika ada poster, kirim sebagai foto
  if (movie.poster_path) {
    return {
      photo: getPosterUrl(movie.poster_path),
      caption: message,
      options
    };
  }
  
  // Jika tidak ada poster, kirim sebagai pesan teks
  return {
    text: message,
    options
  };
}

/**
 * Format daftar film untuk hasil pencarian atau rekomendasi
 * @param {Array} movies - Array data film
 * @returns {String} - Pesan berformat HTML
 */
function formatMovieList(movies) {
  if (!movies || movies.length === 0) {
    return 'Tidak ada film yang ditemukan.';
  }

  let message = '<b>Hasil Pencarian Film:</b>\n\n';
  
  movies.forEach((movie, index) => {
    // Hanya tampilkan 10 film pertama untuk menghindari pesan terlalu panjang
    if (index < 10) {
      const rating = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}/10` : 'Belum ada rating';
      const year = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '';
      
      message += `${index + 1}. <b>${movie.title}</b> ${year} - ${rating}\n/info_${movie.id}\n\n`;
    }
  });
  
  if (movies.length > 10) {
    message += `\n... dan ${movies.length - 10} film lainnya.`;
  }
  
  return message;
}

/**
 * Format pesan untuk rekomendasi film berdasarkan mood
 * @param {String} mood - Mood yang dipilih user
 * @param {Array} movies - Array data film yang direkomendasikan
 * @returns {String} - Pesan berformat HTML
 */
function formatMoodRecommendation(mood, movies) {
  if (!movies || movies.length === 0) {
    return `Maaf, tidak ada rekomendasi film untuk mood "${mood}" saat ini.`;
  }

  let message = `<b>🎭 Rekomendasi Film untuk Mood "${mood}":</b>\n\n`;
  
  movies.forEach((movie, index) => {
    // Tampilkan 7 film teratas saja
    if (index < 7) {
      const rating = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}/10` : 'Belum ada rating';
      const year = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '';
      
      message += `${index + 1}. <b>${movie.title}</b> ${year} - ${rating}\n/info_${movie.id}\n\n`;
    }
  });
  
  message += '\nGunakan /info_{id_film} untuk melihat detail film.\nAtau /mood untuk mencoba mood lain.';
  
  return message;
}

module.exports = {
  formatMovieResult,
  formatMovieList,
  formatMoodRecommendation
};