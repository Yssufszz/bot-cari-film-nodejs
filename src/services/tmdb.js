const axios = require('axios');

// TMDB API configuration
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Mencari film berdasarkan judul
 * @param {string} query - Judul film yang ingin dicari
 * @param {number} page - Halaman hasil pencarian
 * @returns {Promise} - Promise dengan hasil pencarian
 */
async function searchMovies(query, page = 1) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_TOKEN,
        query,
        page,
        language: 'id-ID', // Menggunakan bahasa Indonesia
        include_adult: false,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error mencari film:', error.message);
    throw new Error('Gagal mencari film');
  }
}

/**
 * Mendapatkan detail film berdasarkan ID
 * @param {number} movieId - ID film
 * @returns {Promise} - Promise dengan detail film
 */
async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_TOKEN,
        language: 'id-ID',
        append_to_response: 'videos,similar',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error mendapatkan detail film:', error.message);
    throw new Error('Gagal mendapatkan detail film');
  }
}

/**
 * Mendapatkan rekomendasi film berdasarkan mood
 * @param {string} mood - Mood user (dalam bahasa Indonesia)
 * @returns {Promise} - Promise dengan film-film yang direkomendasikan
 */
async function getMoviesByMood(mood) {
  // Mapping mood bahasa Indonesia ke genre/kategori TMDB
  const moodMap = {
    'senang': { genres: [35, 10402, 10751], sort_by: 'popularity.desc' }, // Comedy, Music, Family
    'sedih': { genres: [18, 10749], sort_by: 'vote_average.desc' },      // Drama, Romance
    'tegang': { genres: [53, 9648, 27], sort_by: 'popularity.desc' },     // Thriller, Mystery, Horror
    'semangat': { genres: [28, 12, 878], sort_by: 'popularity.desc' },    // Action, Adventure, Sci-Fi
    'bosan': { genres: [99, 36, 14], sort_by: 'vote_average.desc' },     // Documentary, History, Fantasy
    'romantis': { genres: [10749, 35], sort_by: 'vote_count.desc' },      // Romance, Comedy
    'takut': { genres: [27, 53], sort_by: 'popularity.desc' },           // Horror, Thriller
    'penasaran': { genres: [9648, 878, 80], sort_by: 'vote_average.desc' } // Mystery, Sci-Fi, Crime
  };
  
  // Default untuk mood yang tidak terdefinisi
  const moodConfig = moodMap[mood.toLowerCase()] || { genres: [28, 12], sort_by: 'popularity.desc' };
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_TOKEN,
        language: 'id-ID',
        sort_by: moodConfig.sort_by,
        with_genres: moodConfig.genres.join(','),
        page: 1,
        include_adult: false,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error mendapatkan rekomendasi film:', error.message);
    throw new Error('Gagal mendapatkan rekomendasi film');
  }
}

/**
 * Mendapatkan URL poster film
 * @param {string} posterPath - Path poster dari TMDB
 * @returns {string} - URL lengkap poster
 */
function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  return `${POSTER_BASE_URL}${posterPath}`;
}

module.exports = {
  searchMovies,
  getMovieDetails,
  getMoviesByMood,
  getPosterUrl,
};