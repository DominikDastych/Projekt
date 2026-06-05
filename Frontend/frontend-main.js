// ── DOM REFERENCE ──
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalDescription = document.getElementById('modal-description');
const modalFavBtn = document.getElementById('modal-fav-btn');

const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const btnAuth = document.getElementById('btn-auth');

const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const btnSettings = document.getElementById('btn-settings');
const lightModeToggle = document.getElementById('light-mode-toggle');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const logoutBtn = document.getElementById('logout-btn');
const settingsUserRow = document.getElementById('settings-user-row');
const settingsUsernameLabel = document.getElementById('settings-username-label');

const historyPanel = document.getElementById('history-panel');
const closeHistory = document.getElementById('close-history');
const btnHistory = document.getElementById('btn-history');
const historyList = document.getElementById('history-list');
const panelOverlay = document.getElementById('panel-overlay');
const clearHistorySideBtn = document.getElementById('clear-history-side-btn');

const btnFavorites = document.getElementById('btn-favorites');
const tabSearch = document.getElementById('tab-search');
const tabFavView = document.getElementById('tab-fav-view');
const heroSection = document.getElementById('hero-section');

// ── STAV ──
let currentMovie = null;
let currentView = 'search';
let lastResults = [];


// ════════════════════════════════
// UŽIVATEL / AUTH
// ════════════════════════════════

const getUser = () => {
    const raw = localStorage.getItem('cv_user');
    return raw ? JSON.parse(raw) : null;
};

const setUser = (user) => {
    if (user) localStorage.setItem('cv_user', JSON.stringify(user));
    else localStorage.removeItem('cv_user');
    updateAuthUI();
};

const updateAuthUI = () => {
    const user = getUser();
    if (user) {
        btnAuth.innerHTML = `<i class="fa-solid fa-user"></i> ${user.username}`;
        btnAuth.classList.add('logged-in');
        settingsUsernameLabel.textContent = `Přihlášen/a jako: ${user.username}`;
        logoutBtn.classList.remove('hidden');
    } else {
        btnAuth.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Přihlásit se';
        btnAuth.classList.remove('logged-in');
        settingsUsernameLabel.textContent = 'Nejsi přihlášen/a';
        logoutBtn.classList.add('hidden');
    }
};

// Kliknutí na auth tlačítko – přihlášení otevře modál, přihlášený otevře nastavení
btnAuth.addEventListener('click', () => {
    if (getUser()) openModal(settingsModal);
    else openModal(authModal);
});

closeAuth.addEventListener('click', () => closeModalEl(authModal));

// ── PŘEPÍNÁNÍ AUTH TABŮ ──
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const which = tab.dataset.tab;
        document.getElementById('login-form').classList.toggle('hidden', which !== 'login');
        document.getElementById('register-form').classList.toggle('hidden', which !== 'register');
        document.getElementById('login-msg').textContent = '';
        document.getElementById('reg-msg').textContent = '';
    });
});

// ── PŘIHLÁŠENÍ ──
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const msg = document.getElementById('login-msg');

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            msg.textContent = data.error;
            msg.className = 'auth-msg error';
        } else {
            setUser({ username: data.username });
            closeModalEl(authModal);
            document.getElementById('login-form').reset();
            msg.textContent = '';
        }
    } catch {
        msg.textContent = 'Chyba připojení k serveru';
        msg.className = 'auth-msg error';
    }
});

// ── REGISTRACE ──
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const msg = document.getElementById('reg-msg');

    if (password !== password2) {
        msg.textContent = 'Hesla se neshodují';
        msg.className = 'auth-msg error';
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            msg.textContent = data.error;
            msg.className = 'auth-msg error';
        } else {
            msg.textContent = 'Registrace úspěšná! Přihlašuji...';
            msg.className = 'auth-msg success';
            setTimeout(() => {
                setUser({ username: data.username });
                closeModalEl(authModal);
                document.getElementById('register-form').reset();
                msg.textContent = '';
            }, 900);
        }
    } catch {
        msg.textContent = 'Chyba připojení k serveru';
        msg.className = 'auth-msg error';
    }
});


// ════════════════════════════════
// NASTAVENÍ
// ════════════════════════════════

btnSettings.addEventListener('click', () => openModal(settingsModal));
closeSettings.addEventListener('click', () => closeModalEl(settingsModal));

logoutBtn.addEventListener('click', () => {
    setUser(null);
    closeModalEl(settingsModal);
    if (currentView === 'favorites') {
        currentView = 'search';
        tabSearch.classList.add('active');
        tabFavView.classList.remove('active');
        heroSection.style.display = '';
        fetchMovies();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
    clearHistoryBtn.innerHTML = '<i class="fa-solid fa-check"></i> Smazáno';
    setTimeout(() => { clearHistoryBtn.innerHTML = 'Smazat historii'; }, 1500);
});


// ════════════════════════════════
// TMAVÝ / SVĚTLÝ REŽIM
// ════════════════════════════════

const loadTheme = () => {
    const theme = localStorage.getItem('cv_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    lightModeToggle.checked = (theme === 'light');
};

lightModeToggle.addEventListener('change', () => {
    const theme = lightModeToggle.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cv_theme', theme);
});


// ════════════════════════════════
// HISTORIE VYHLEDÁVÁNÍ
// ════════════════════════════════

const getHistoryKey = () => {
    const u = getUser();
    return `cv_history_${u ? u.username : 'guest'}`;
};

const getHistory = () => JSON.parse(localStorage.getItem(getHistoryKey()) || '[]');

const addToHistory = (term) => {
    if (!term.trim()) return;
    let history = getHistory().filter(h => h.toLowerCase() !== term.toLowerCase());
    history.unshift(term.trim());
    if (history.length > 25) history = history.slice(0, 25);
    localStorage.setItem(getHistoryKey(), JSON.stringify(history));
};

const removeFromHistory = (term) => {
    const history = getHistory().filter(h => h !== term);
    localStorage.setItem(getHistoryKey(), JSON.stringify(history));
    renderHistoryPanel();
};

const clearHistory = () => {
    localStorage.removeItem(getHistoryKey());
    renderHistoryPanel();
};

const renderHistoryPanel = () => {
    const history = getHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-panel">Žádná historie vyhledávání</li>';
        return;
    }

    history.forEach(term => {
        const li = document.createElement('li');

        const termSpan = document.createElement('span');
        termSpan.className = 'history-term';
        termSpan.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> `;
        termSpan.appendChild(document.createTextNode(term));
        termSpan.addEventListener('click', () => {
            searchInput.value = term;
            closeHistoryPanel();
            fetchMovies(term);
        });

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-history-item';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Odebrat';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromHistory(term);
        });

        li.appendChild(termSpan);
        li.appendChild(removeBtn);
        historyList.appendChild(li);
    });
};

const openHistoryPanel = () => {
    renderHistoryPanel();
    historyPanel.classList.add('open');
    panelOverlay.classList.add('visible');
};

const closeHistoryPanel = () => {
    historyPanel.classList.remove('open');
    panelOverlay.classList.remove('visible');
};

btnHistory.addEventListener('click', openHistoryPanel);
closeHistory.addEventListener('click', closeHistoryPanel);
panelOverlay.addEventListener('click', closeHistoryPanel);
clearHistorySideBtn.addEventListener('click', clearHistory);


// ════════════════════════════════
// OBLÍBENÉ FILMY
// ════════════════════════════════

const getFavKey = () => {
    const u = getUser();
    return `cv_favorites_${u ? u.username : 'guest'}`;
};

const getFavorites = () => JSON.parse(localStorage.getItem(getFavKey()) || '[]');

const isFavorite = (movieId) => getFavorites().some(f => f.id === movieId);

const toggleFavorite = (movie) => {
    let favs = getFavorites();
    if (isFavorite(movie.id)) {
        favs = favs.filter(f => f.id !== movie.id);
    } else {
        favs.push(movie);
    }
    localStorage.setItem(getFavKey(), JSON.stringify(favs));
};

const showFavorites = () => {
    if (!getUser()) {
        openModal(authModal);
        return;
    }

    currentView = 'favorites';
    tabSearch.classList.remove('active');
    tabFavView.classList.add('active');
    heroSection.style.display = 'none';

    const favs = getFavorites();
    if (favs.length === 0) {
        movieContainer.innerHTML = '<p class="hint">Zatím nemáš žádné oblíbené filmy.<br>Klikni na <i class="fa-regular fa-star"></i> u libovolného filmu.</p>';
    } else {
        renderMovies(favs, false);
    }
};

const showSearchView = () => {
    currentView = 'search';
    tabSearch.classList.add('active');
    tabFavView.classList.remove('active');
    heroSection.style.display = '';
    renderMovies(lastResults, true);
};

btnFavorites.addEventListener('click', showFavorites);
tabFavView.addEventListener('click', showFavorites);
tabSearch.addEventListener('click', () => {
    if (currentView !== 'search') showSearchView();
});


// ════════════════════════════════
// MODÁLY – OBECNÉ FUNKCE
// ════════════════════════════════

const openModal = (el) => { el.style.display = 'flex'; };
const closeModalEl = (el) => { el.style.display = 'none'; };

[modal, authModal, settingsModal].forEach(m => {
    m.addEventListener('click', (e) => {
        if (e.target === m) closeModalEl(m);
    });
});


// ════════════════════════════════
// FILMY – FETCH A RENDER
// ════════════════════════════════

const fetchMovies = async (queryOverride = null) => {
    const query = queryOverride || searchInput.value.trim() || 'star';

    if (currentView === 'favorites') {
        currentView = 'search';
        tabSearch.classList.add('active');
        tabFavView.classList.remove('active');
        heroSection.style.display = '';
    }

    movieContainer.innerHTML = '<p>Načítám filmy...</p>';

    try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const movies = await res.json();
        lastResults = Array.isArray(movies) ? movies : [];
        renderMovies(lastResults, true);

        if (searchInput.value.trim()) {
            addToHistory(searchInput.value.trim());
        }
    } catch {
        movieContainer.innerHTML = '<p class="hint">Chyba při načítání dat ze serveru.</p>';
    }
};

const renderMovies = (movies, storeAsLast = false) => {
    if (storeAsLast) lastResults = movies;
    movieContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p class="hint">Žádné filmy nenalezeny.</p>';
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.id = movie.id;

        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Poster';
        const fav = isFavorite(movie.id);

        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}" loading="lazy">
            <button class="card-fav-btn ${fav ? 'active' : ''}" title="${fav ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}">
                <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
            <div class="card-body">
                <h2>${movie.title} (${year})</h2>
                <p><strong>Hodnocení:</strong> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</p>
                <span class="detail-badge">Klikni pro detail</span>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-fav-btn')) {
                openMovieDetail(movie, poster);
            }
        });

        card.querySelector('.card-fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (!getUser()) { openModal(authModal); return; }
            toggleFavorite(movie);
            const nowFav = isFavorite(movie.id);
            const btn = e.currentTarget;
            btn.classList.toggle('active', nowFav);
            btn.innerHTML = `<i class="${nowFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>`;
            btn.title = nowFav ? 'Odebrat z oblíbených' : 'Přidat do oblíbených';

            if (currentView === 'favorites' && !nowFav) {
                showFavorites();
            }
        });

        movieContainer.appendChild(card);
    });
};


// ════════════════════════════════
// DETAIL FILMU
// ════════════════════════════════

const openMovieDetail = (movie, posterUrl) => {
    currentMovie = movie;
    modalImg.src = posterUrl;
    modalTitle.textContent = movie.title;
    modalRating.textContent = [
        `Hodnocení: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10`,
        movie.release_date ? `· ${movie.release_date.split('-')[0]}` : ''
    ].filter(Boolean).join('  ');
    modalDescription.textContent = movie.overview || 'Popis není k dispozici.';
    updateModalFavBtn();
    openModal(modal);
};

const updateModalFavBtn = () => {
    if (!currentMovie) return;
    const fav = isFavorite(currentMovie.id);
    modalFavBtn.innerHTML = fav
        ? '<i class="fa-solid fa-star"></i> Odebrat z oblíbených'
        : '<i class="fa-regular fa-star"></i> Přidat do oblíbených';
    modalFavBtn.classList.toggle('active', fav);
};

modalFavBtn.addEventListener('click', () => {
    if (!currentMovie) return;
    if (!getUser()) { openModal(authModal); return; }
    toggleFavorite(currentMovie);
    updateModalFavBtn();

    // Aktualizace ikony na kartě bez znovu-fetchování
    const card = movieContainer.querySelector(`[data-id="${currentMovie.id}"]`);
    if (card) {
        const fav = isFavorite(currentMovie.id);
        const btn = card.querySelector('.card-fav-btn');
        btn.classList.toggle('active', fav);
        btn.innerHTML = `<i class="${fav ? 'fa-solid' : 'fa-regular'} fa-star"></i>`;
        btn.title = fav ? 'Odebrat z oblíbených' : 'Přidat do oblíbených';
    }

    if (currentView === 'favorites' && !isFavorite(currentMovie.id)) {
        closeModalEl(modal);
        showFavorites();
    }
});

closeModal.addEventListener('click', () => closeModalEl(modal));


// ════════════════════════════════
// VYHLEDÁVÁNÍ
// ════════════════════════════════

searchButton.addEventListener('click', () => fetchMovies());

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchMovies();
});


// ════════════════════════════════
// INICIALIZACE
// ════════════════════════════════

loadTheme();
updateAuthUI();
fetchMovies();
