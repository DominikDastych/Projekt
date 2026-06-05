const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');

// ── HLAVNÍ FUNKCE HLEDÁNÍ ──
// Spustí se po kliknutí na tlačítko nebo stisknutí Enter
const fetchMovies = async () => {
    const query = searchInput.value;

    // Kontrola prázdného pole – upozorní uživatele
    if (!query) {
        alert('Please enter a movie title');
        return;
    }

    // Zobrazení načítání dokud server neodpoví
    movieContainer.innerHTML = '<p>Loading movies...</p>';

    try {
        // Volání backendu (server.js) – ten se stará o TMDB API klíč
        // encodeURIComponent zajistí správné kódování speciálních znaků v názvu
        const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`);

        // Převod odpovědi ze serveru do JS pole objektů
        const movies = await response.json();

        // Předání dat do funkce pro vykreslení karet
        renderMovies(movies);
    } catch (error) {
        // Chyba sítě nebo server neběží
        console.error('Fetch error:', error);
        movieContainer.innerHTML = '<p>Error loading data from server.</p>';
    }
};

// ── RENDEROVÁNÍ FILMOVÝCH KARET ──
// Přijme pole filmů z TMDB API a vykreslí je do #movie-container
const renderMovies = (movies) => {
    movieContainer.innerHTML = ''; // Vymazání předchozích výsledků

    // Pokud TMDB nic nenašlo, zobrazí zprávu
    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    // Iterace přes každý film a vytvoření HTML karty
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card'; // Třída pro CSS stylování

        // TMDB vrací datum ve formátu YYYY-MM-DD, stačí nám jen rok
        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

        // Pokud film nemá poster, použije se placeholder obrázek
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Poster';

        // Vložení HTML struktury karty s daty z TMDB
        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" width="200">
            <div>
                <h2>${movie.title} (${releaseYear})</h2>
                <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
                <p>${movie.overview || 'No description available.'}</p>
            </div>
            <hr>
        `;

        // Přidání hotové karty do stránky
        movieContainer.appendChild(movieCard);
    });
};

// Kliknutí na tlačítko spustí hledání
searchButton.addEventListener('click', fetchMovies);

// Stisknutí Enter v inputu spustí hledání (stejné chování jako tlačítko)
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchMovies();
});