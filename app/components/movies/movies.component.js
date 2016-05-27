import React, { PropTypes } from 'react';

import style from './movies.component.scss';

export default function Movies(props) {
  const {
    loadMoreMovies, movies, MovieContainer, isWaiting, hasMore,
  } = props;

  const moviesToRender = movies.map(movie =>
    <MovieContainer key={movie.id} movie={movie} />
  );

  let loadingBlock;
  let buttonsBlock;
  if (hasMore) {
    if (isWaiting) {
      loadingBlock = (
        <div className={style.loading}>
          Loading
        </div>
      );
    } else {
      buttonsBlock = (
        <div className={style.buttons}>
          <button className={style.button} onClick={loadMoreMovies}>Load More</button>
        </div>
      );
    }
  }

  return (
    <div>
      <div className={style.movies}>
        {moviesToRender}
      </div>
      {loadingBlock}
      {buttonsBlock}
    </div>
  );
}

Movies.propTypes = {
  loadMoreMovies: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
  MovieContainer: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
};
