const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const movieContainer = document.getElementById('movie-container');

const fetchMovies = async () => {
    const query = searchInput.value;

    if (!query) {
        alert('Please enter a movie title');
        return;
    }

    movieContainer.innerHTML = '<p>Loading movies...</p>';

    try {
        const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`);
        const movies = await response.json();

        renderMovies(movies);
    } catch (error) {
        console.error('Fetch error:', error);
        movieContainer.innerHTML = '<p>Error loading data from server.</p>';
    }
};

const renderMovies = (movies) => {
    movieContainer.innerHTML = ''; // Clear previous results

    if (movies.length === 0) {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card'; // Ready for CSS styling later

        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Poster';

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" width="200">
            <div>
                <h2>${movie.title} (${releaseYear})</h2>
                <p><strong>Rating:</strong> ${movie.vote_average}/10</p>
                <p>${movie.overview || 'No description available.'}</p>
            </div>
            <hr>
        `;

        movieContainer.appendChild(movieCard);
    });
};

searchButton.addEventListener('click', fetchMovies);

// Allow searching by pressing Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchMovies();
});