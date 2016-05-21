import React, { PropTypes } from 'react';

import Movies from '../../../components/movies/movies.component';

export default function MoviesTestContainer() {
  function noop() {}

  function FakeMovieContainer({ movie }) {
    return (
      <div style={{ margin: '10px' }}>
        {movie.value}
      </div>
    );
  }

  FakeMovieContainer.propTypes = {
    movie: PropTypes.any,
  };

  const oneMovie = [{ id: 1, value: 'movie1' }];
  const twoMovies = oneMovie.concat([{ id: 2, value: 'movie2' }]);
  const lotsOfMovies = [];
  for (let i = 1; i <= 100; i++) {
    lotsOfMovies.push({
      id: i,
      value: `movie${i}`,
    });
  }

  return (
    <div>
      <h1>No Movies</h1>
      <Movies
        loadMoreMovies={noop}
        movies={[]}
        MovieContainer={FakeMovieContainer}
        isWaiting={false}
      />
      <hr />

      <h1>One Movie</h1>
      <Movies
        loadMoreMovies={noop}
        movies={oneMovie}
        MovieContainer={FakeMovieContainer}
        isWaiting={false}
      />
      <hr />

      <h1>Two Movies</h1>
      <Movies
        loadMoreMovies={noop}
        movies={twoMovies}
        MovieContainer={FakeMovieContainer}
        isWaiting={false}
      />
      <hr />

      <h1>Lots of Movies</h1>
      <Movies
        loadMoreMovies={noop}
        movies={lotsOfMovies}
        MovieContainer={FakeMovieContainer}
        isWaiting={false}
      />
      <hr />

      <h1>Waiting for Movies</h1>
      <Movies
        loadMoreMovies={noop}
        movies={[]}
        MovieContainer={FakeMovieContainer}
        isWaiting
      />
      <hr />

      <h1>Movies Loaded Waiting for Movies</h1>
      <Movies
        loadMoreMovies={noop}
        movies={lotsOfMovies}
        MovieContainer={FakeMovieContainer}
        isWaiting
      />
      <hr />
    </div>
  );
}
