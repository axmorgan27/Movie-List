import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMovie, setNewMovie] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, [filter]);

  const fetchMovies = async () => {
    try {
      const url = new URL('http://localhost:3001/api/movies');
      url.searchParams.append('filter', filter);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network failed');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const url = new URL('http://localhost:3001/api/movies');
      url.searchParams.append('search', searchTerm);
      url.searchParams.append('filter', filter);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network failed');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!newMovie.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newMovie, watched: false }),
      });
      if (!response.ok) throw new Error('Network failed');
      setNewMovie('');
      fetchMovies();
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network failed');
      fetchMovies();
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleToggleWatched = async (id, currentWatched) => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watched: !currentWatched }),
      });
      if (!response.ok) throw new Error('Network failed');
      fetchMovies();
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div className="container">
      <h1>Movie's For You</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Movies"
          className="input"
        />
        <button type="submit" className="button button-blue">Search</button>
      </form>

      {/* Add Movie Form */}
      <form onSubmit={handleAddMovie} className="form">
        <input
          type="text"
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
          placeholder="Add New Movie"
          className="input"
        />
        <button type="submit" className="button button-green">Add Movie</button>
      </form>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={`button ${filter === 'all' ? 'button-active' : ''}`}
        >
          All Movies
        </button>
        <button
          onClick={() => setFilter('watched')}
          className={`button ${filter === 'watched' ? 'button-active' : ''}`}
        >
          Watched
        </button>
        <button
          onClick={() => setFilter('toWatch')}
          className={`button ${filter === 'toWatch' ? 'button-active' : ''}`}
        >
          To Watch
        </button>
      </div>

      {/* Movie List */}
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id} className="movie-item">
            <span className={movie.watched ? 'watched' : ''}>
              {movie.title}
            </span>
            <button
              onClick={() => handleToggleWatched(movie.id, movie.watched)}
              className="button button-yellow"
            >
              {movie.watched ? 'Mark Unwatched' : 'Mark Watched'}
            </button>
            <button
              onClick={() => handleDeleteMovie(movie.id)}
              className="button button-red"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;