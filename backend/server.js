const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// ── API KLÍČ PRO TMDB ──
// Tento klíč nikdy nedávej do frontendu – jen na serveru
const TMDB_API_KEY = '246ba6c1cbba7c8836da050188df1400';

// ── MIDDLEWARE ──

// Povolení CORS – frontend může volat tento server z jiného portu
app.use(cors());

// Parsování JSON těla requestů (pro případné POST requesty)
app.use(express.json());

// Servírování statických souborů (index.html, main.js, CSS) ze stejné složky
app.use(express.static(path.join(__dirname, '../Frontend')));

// ── API ENDPOINT: HLEDÁNÍ FILMŮ ──
// Frontend volá: GET /api/search?query=název_filmu
app.get('/api/search', async (req, res) => {
    // Načtení search query z URL parametru
    const movieTitle = req.query.query;

    // Validace – query nesmí být prázdné
    if (!movieTitle) {
        return res.status(400).json({ error: 'Query parameter "query" is missing' });
    }

    try {
        // Dotaz na TMDB API – hledání podle názvu filmu
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_API_KEY,  // Autentizace pomocí API klíče
                query: movieTitle,       // Hledaný název z frontendu
                language: 'cs-CZ'        // Výsledky v češtině (název, popis)
            }
        });

        // Vrátí pouze pole filmů (results), ne celou TMDB odpověď
        res.json(response.data.results);
    } catch (error) {
        // Logování chyby na serveru pro debugging
        console.error('TMDb API Error:', error.message);

        // Odpověď frontendu s chybou 500
        res.status(500).json({
            error: 'Failed to fetch data from TMDb API',
            details: error.message
        });
    }
});

// ── ZÁKLADNÍ ROUTE ──
// Zobrazí se pokud někdo otevře server přímo bez index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// ── SPUŠTĚNÍ SERVERU ──
// Server naslouchá na portu 3000
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`  MOVIE DASHBOARD SERVER IS LIVE!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log('==============================================');
});