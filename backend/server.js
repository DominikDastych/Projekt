const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const TMDB_API_KEY = '246ba6c1cbba7c8836da050188df1400';
const USERS_FILE = path.join(__dirname, 'users.json');

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

// ── HELPERS ──
const loadUsers = () => {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
    catch { return []; }
};

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const hashPassword = (pw) => crypto.createHash('sha256').update(pw).digest('hex');

// ── REGISTRACE ──
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Chybí přihlašovací údaje' });
    if (username.trim().length < 3) return res.status(400).json({ error: 'Jméno musí mít alespoň 3 znaky' });
    if (password.length < 4) return res.status(400).json({ error: 'Heslo musí mít alespoň 4 znaky' });

    const users = loadUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(409).json({ error: 'Toto uživatelské jméno je již obsazené' });
    }

    users.push({ username: username.trim(), password: hashPassword(password) });
    saveUsers(users);
    res.json({ success: true, username: username.trim() });
});

// ── PŘIHLÁŠENÍ ──
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Chybí přihlašovací údaje' });

    const users = loadUsers();
    const user = users.find(u =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === hashPassword(password)
    );

    if (!user) return res.status(401).json({ error: 'Špatné jméno nebo heslo' });
    res.json({ success: true, username: user.username });
});

// ── HLEDÁNÍ FILMŮ ──
app.get('/api/search', async (req, res) => {
    const movieTitle = req.query.query;
    if (!movieTitle) return res.status(400).json({ error: 'Query parameter "query" is missing' });

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
        res.status(500).json({ error: 'Failed to fetch data from TMDb API', details: error.message });
    }
});

// ── ZÁKLADNÍ ROUTE ──
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// ── SPUŠTĚNÍ SERVERU ──
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`  CINEVAULT SERVER IS LIVE!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log('==============================================');
});
