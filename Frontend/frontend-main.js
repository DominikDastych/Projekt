const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalDescription = document.getElementById('modal-description');


// ── HLAVNÍ FUNKCE HLEDÁNÍ ──

const fetchMovies = async (defaultQuery = 'star') => {
    const query = searchInput.value || defaultQuery;

    movieContainer.innerHTML = '<p>Loading movies...</p>';

    try {
        const response = await fetch(
            `http://localhost:3000/api/search?query=${encodeURIComponent(query)}`
        );

        const movies = await response.json();

        renderMovies(movies);
    } catch (error) {
        console.error('Fetch error:', error);
        movieContainer.innerHTML = '<p>Error loading data from server.</p>';
    }
};


// ── VYKRESLENÍ KARET ──

const renderMovies = (movies) => {
    movieContainer.innerHTML = '';

    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const releaseYear = movie.release_date
            ? movie.release_date.split('-')[0]
            : 'N/A';

        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Poster';

        movieCard.innerHTML = `
    <img src="${posterUrl}" alt="${movie.title}">
    <div>
        <h2>${movie.title} (${releaseYear})</h2>
        <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)}/10</p>
        <span class="detail-badge">Klikni pro detail</span>
    </div>
`;

        movieCard.addEventListener('click', () => {
            openMovieDetail(movie, posterUrl);
        });

        movieContainer.appendChild(movieCard);
    });
};


// ── DETAIL FILMU ──

const openMovieDetail = (movie, posterUrl) => {
    modalImg.src = posterUrl;
    modalTitle.textContent = movie.title;
    modalRating.textContent = `Rating: ${movie.vote_average}/10`;
    modalDescription.textContent =
        movie.overview || 'No description available.';

    modal.style.display = 'flex';
};


// ── ZAVŘENÍ DETAILU ──

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});


// ── HLEDÁNÍ ──

searchButton.addEventListener('click', () => {
    fetchMovies();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchMovies();
    }
});


// ── ÚVODNÍ FILMY PO SPUŠTĚNÍ ──

fetchMovies();