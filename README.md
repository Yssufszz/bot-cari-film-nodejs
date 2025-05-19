# Movie Telegram Bot

Bot Telegram untuk pencarian film dan rekomendasi berdasarkan mood menggunakan TMDB API.

## Fitur

- **Pencarian Film**: Mencari film berdasarkan judul
- **Detail Film**: Menampilkan informasi lengkap tentang film, termasuk poster, rating, dan sinopsis
- **Rekomendasi Mood**: Mendapatkan rekomendasi film berdasarkan mood user (dalam Bahasa Indonesia)
- **Film Serupa**: Menemukan film-film yang mirip dengan film tertentu

## Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/username/movie-telegram-bot.git
cd movie-telegram-bot
```

2. Install dependensi:
```bash
npm install
```

3. Buat file `.env` di root project dan tambahkan:
```
TMDB_API_TOKEN=your_TMDB_API_TOKEN_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

## Cara Mendapatkan API Key

### TMDB API Key
1. Daftar di [TMDB](https://www.themoviedb.org/signup)
2. Pergi ke Settings > API
3. Buat API key baru

### Telegram Bot Token
1. Bicara dengan [@BotFather](https://t.me/BotFather) di Telegram
2. Gunakan perintah `/newbot` dan ikuti instruksinya
3. Salin token bot yang diberikan

## Menjalankan Bot

```bash
# Mode pengembangan (dengan nodemon)
npm run dev

# Mode produksi
npm start
```

## Struktur Project

```
movie-telegram-bot/
│
├── .env                      # Menyimpan API key (TMDB_API_TOKEN, TELEGRAM_BOT_TOKEN)
├── .gitignore                # File untuk mengabaikan file tertentu saat push ke git
├── package.json              # Konfigurasi project dan dependensi
├── index.js                  # File utama untuk menjalankan bot
│
├── src/
│   ├── bot.js                # Konfigurasi bot Telegram
│   ├── commands/             # Folder untuk menyimpan command handlers
│   │   ├── start.js          # Command /start
│   │   ├── help.js           # Command /help
│   │   ├── search.js         # Command /search untuk mencari film
│   │   └── mood.js           # Command /mood untuk rekomendasi berdasarkan mood
│   │
│   ├── services/             # Folder untuk services/API
│   │   └── tmdb.js           # Service untuk berkomunikasi dengan TMDB API
│   │
│   └── utils/                # Utility functions
│       ├── keyboard.js       # Utility untuk membuat keyboard Telegram
│       └── formatter.js      # Utility untuk memformat pesan
│
└── README.md                 # Dokumentasi project
```

## Perintah Bot

- `/start` - Memulai bot dan menampilkan menu utama
- `/search` - Mencari film berdasarkan judul
- `/mood` - Mendapatkan rekomendasi film berdasarkan mood
- `/help` - Menampilkan bantuan dan informasi perintah

## Teknologi yang Digunakan

- Node.js
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [TMDB API](https://developers.themoviedb.org/3)
- Axios
- Dotenv

## Kontribusi

Kontribusi selalu diterima. Silakan buat pull request atau laporkan issue jika menemukan bug.

## Lisensi

MIT License