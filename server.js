const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


const TMDB_API_KEY = '246ba6c1cbba7c8836da050188df1400';


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '.')));

app.get('/api/search', async (req, res) => {
    const movieTitle = req.query.query;

    if (!movieTitle) {
        return res.status(400).json({ error: 'Query parameter "query" is missing' });
    }

    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_API_KEY,
                query: movieTitle,
                language: 'cs-CZ'
            }
        });

        res.json(response.data.results);
    } catch (error) {
        console.error('TMDb API Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch data from TMDb API',
            details: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.send('Movie Dashboard Server is running. Open your browser at http://localhost:3000 to see the app.');
});


app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`  MOVIE DASHBOARD SERVER IS LIVE!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log('==============================================');
});