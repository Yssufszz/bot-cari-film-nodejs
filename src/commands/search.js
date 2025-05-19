const { searchMovies, getMovieDetails, getPosterUrl } = require('../services/tmdb');
const { formatMovieResult, formatMovieList } = require('../utils/formatter');
const { createPaginationKeyboard } = require('../utils/keyboard');

/**
 * Handler untuk command /search
 * @param {Object} bot - Instance bot Telegram
 */
function searchCommand(bot) {
  // Menangani perintah /search
  bot.onText(/\/search/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Command /search dijalankan oleh user ID: ${chatId}`);
    
    bot.sendMessage(
      chatId, 
      'Silakan ketik judul film yang ingin Anda cari:',
      { reply_markup: { force_reply: true } }
    ).then((sentMessage) => {
      console.log(`Pesan reply markup terkirim, message ID: ${sentMessage.message_id}`);
      
      // Listener untuk reply dari user
      const replyListenerId = bot.onReplyToMessage(chatId, sentMessage.message_id, async (replyMsg) => {
        const searchQuery = replyMsg.text.trim();
        console.log(`Menerima reply untuk pencarian: "${searchQuery}"`);
        
        if (searchQuery) {
          try {
            // Mengirim pesan "sedang mencari"
            console.log(`Memulai pencarian untuk: "${searchQuery}"`);
            const loadingMsg = await bot.sendMessage(
              chatId, 
              `🔍 Sedang mencari film "${searchQuery}"...`
            );
            
            // Mencari film
            console.log(`Memanggil API searchMovies dengan query: ${searchQuery}`);
            const searchResults = await searchMovies(searchQuery);
            console.log(`Hasil pencarian diterima dengan ${searchResults?.results?.length || 0} film`);
            
            // Hapus pesan loading
            await bot.deleteMessage(chatId, loadingMsg.message_id).catch(e => console.log('Tidak bisa menghapus pesan loading:', e.message));
            
            // Jika tidak ada hasil
            if (!searchResults || !searchResults.results || searchResults.total_results === 0) {
              console.log(`Tidak ada hasil ditemukan untuk: "${searchQuery}"`);
              bot.sendMessage(
                chatId, 
                `Maaf, tidak ditemukan film dengan judul "${searchQuery}". Silakan coba dengan kata kunci lain.`
              );
              return;
            }
            
            // Format dan kirim hasil pencarian
            console.log(`Memformat ${searchResults.results.length} hasil pencarian`);
            const messageText = formatMovieList(searchResults.results);
            
            // Compress query untuk pagination
            const queryId = Buffer.from(searchQuery).toString('base64').replace(/=/g, '').substring(0, 10);
            
            console.log(`Mengirim hasil pencarian dengan pagination, queryId: ${queryId}`);
            bot.sendMessage(chatId, messageText, {
              parse_mode: 'HTML',
              reply_markup: createPaginationKeyboard(
                searchResults.page, 
                searchResults.total_pages,
                queryId
              ).reply_markup
            }).then(() => {
              console.log('Hasil pencarian berhasil dikirim');
            }).catch(err => {
              console.error('Error saat mengirim hasil:', err);
              // Coba kirim tanpa pagination jika terjadi error
              bot.sendMessage(chatId, messageText, { parse_mode: 'HTML' });
            });
          } catch (error) {
            console.error('Error detail pada pencarian film:', error);
            bot.sendMessage(
              chatId, 
              'Maaf, terjadi kesalahan saat mencari film. Silakan coba lagi nanti.'
            );
          }
        } else {
          console.log('Pencarian dibatalkan - query kosong');
          bot.sendMessage(
            chatId, 
            'Pencarian dibatalkan. Silakan ketik /search untuk mencari lagi.'
          );
        }
        
        // Hapus listener setelah digunakan
        console.log(`Menghapus reply listener ID: ${replyListenerId}`);
        bot.removeReplyListener(replyListenerId);
      });
    }).catch(error => {
      console.error('Error saat mengirim pesan pencarian:', error);
    });
  });
  
  // Menangani tombol halaman untuk paginasi hasil pencarian
  bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    
    if (data.startsWith('page_')) {
      try {
        const [, queryId, pageStr] = data.split('_');
        const page = parseInt(pageStr, 10);
        
        // Decode query
        let decodedQuery;
        try {
          decodedQuery = Buffer.from(queryId, 'base64').toString();
        } catch (e) {
          console.error('Error decoding base64:', e);
          decodedQuery = queryId; // Fallback jika decode gagal
        }
        
        console.log(`Pagination dijalankan: query=${decodedQuery}, page=${page}`);
        
        // Menampilkan indikator loading
        await bot.answerCallbackQuery(callbackQuery.id, { text: "Mengambil halaman..." });
        
        // Mencari film dengan halaman yang dipilih
        console.log(`Memanggil searchMovies untuk halaman ${page}`);
        const searchResults = await searchMovies(decodedQuery, page);
        console.log(`Hasil pagination diterima: ${searchResults.results.length} hasil`);
        
        // Format hasil pencarian
        const messageText = formatMovieList(searchResults.results);
        
        // Edit pesan dengan hasil halaman baru
        await bot.editMessageText(messageText, {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          parse_mode: 'HTML',
          reply_markup: createPaginationKeyboard(
            searchResults.page, 
            searchResults.total_pages,
            queryId
          ).reply_markup
        });
        
        console.log(`Pesan pagination berhasil diupdate ke halaman ${page}`);
      } catch (error) {
        console.error('Error pada paginasi pencarian film:', error);
        bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Maaf, terjadi kesalahan saat mengambil halaman. Silakan coba lagi.',
          show_alert: true
        });
      }
    }
  });
  
  // Command /cari [judul] yang lebih sederhana tanpa reply
  bot.onText(/\/cari (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const searchQuery = match[1].trim();
    console.log(`Command /cari dijalankan dengan query: "${searchQuery}"`);
    
    try {
      // Mengirim pesan "sedang mencari"
      const loadingMsg = await bot.sendMessage(
        chatId, 
        `🔍 Sedang mencari film "${searchQuery}"...`
      );
      
      // Mencari film
      console.log(`Memanggil API searchMovies untuk /cari dengan query: ${searchQuery}`);
      const searchResults = await searchMovies(searchQuery);
      console.log(`/cari mendapatkan ${searchResults?.results?.length || 0} hasil`);
      
      // Hapus pesan loading
      await bot.deleteMessage(chatId, loadingMsg.message_id).catch(e => console.log('Tidak bisa menghapus pesan loading:', e.message));
      
      // Jika tidak ada hasil
      if (!searchResults || !searchResults.results || searchResults.total_results === 0) {
        bot.sendMessage(
          chatId, 
          `Maaf, tidak ditemukan film dengan judul "${searchQuery}". Silakan coba dengan kata kunci lain.`
        );
        return;
      }
      
      // Format dan kirim hasil pencarian dengan pagination
      const messageText = formatMovieList(searchResults.results);
      const queryId = Buffer.from(searchQuery).toString('base64').replace(/=/g, '').substring(0, 10);
      
      bot.sendMessage(chatId, messageText, {
        parse_mode: 'HTML',
        reply_markup: createPaginationKeyboard(
          searchResults.page, 
          searchResults.total_pages,
          queryId
        ).reply_markup
      }).then(() => {
        console.log('Hasil pencarian /cari berhasil dikirim');
      }).catch(err => {
        console.error('Error saat kirim hasil /cari:', err);
        // Fallback tanpa pagination
        bot.sendMessage(chatId, messageText, { parse_mode: 'HTML' });
      });
    } catch (error) {
      console.error('Error pada command /cari:', error);
      bot.sendMessage(
        chatId, 
        'Maaf, terjadi kesalahan saat mencari film. Silakan coba lagi nanti.'
      );
    }
  });
  
  // Menangani detail film dengan command /info_{id}
  bot.onText(/\/info_(\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const movieId = match[1];
    console.log(`Command /info_${movieId} dijalankan`);
    
    try {
      // Mengirim pesan loading
      const loadingMsg = await bot.sendMessage(
        chatId, 
        '⏳ Sedang mengambil detail film...'
      );
      
      // Ambil detail film
      console.log(`Mengambil detail film ID: ${movieId}`);
      const movieDetails = await getMovieDetails(movieId);
      console.log(`Detail film diterima untuk: ${movieDetails?.title || 'unknown'}`);
      
      // Hapus pesan loading
      await bot.deleteMessage(chatId, loadingMsg.message_id).catch(e => console.log('Tidak bisa menghapus pesan loading:', e.message));
      
      // Format dan kirim detail film
      const result = formatMovieResult(movieDetails, getPosterUrl);
      
      if (result.photo) {
        // Kirim dengan foto jika ada poster
        await bot.sendPhoto(chatId, result.photo, {
          caption: result.caption,
          parse_mode: 'HTML',
          ...result.options
        }).then(() => console.log('Detail film dengan poster berhasil dikirim'))
        .catch(err => {
          console.error('Error saat kirim foto:', err);
          // Fallback ke text-only jika gagal kirim foto
          bot.sendMessage(chatId, result.text || result.caption, { parse_mode: 'HTML' });
        });
      } else {
        // Kirim sebagai teks jika tidak ada poster
        await bot.sendMessage(chatId, result.text || 'Info film tidak tersedia', { 
          parse_mode: 'HTML',
          ...result.options 
        })
        .then(() => console.log('Detail film tanpa poster berhasil dikirim'));
      }
    } catch (error) {
      console.error('Error mendapatkan detail film:', error);
      bot.sendMessage(
        chatId, 
        'Maaf, terjadi kesalahan saat mengambil detail film. Silakan coba lagi nanti.'
      );
    }
  });
}

module.exports = searchCommand;