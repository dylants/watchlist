import React, { PropTypes } from 'react';

import style from './movies.component.scss';

import MovieContainer from '../../containers/movie/movie.container';

export default function Movies(props) {
  const moviesToRender = props.movies.map(movie =>
    <MovieContainer key={movie.id} movie={movie} />
  );

  return (
    <div>
      {moviesToRender}
      <div className={style.buttons}>
        <button className={style.button} onClick={props.loadMoreMovies}>Load More</button>
      </div>
    </div>
  );
}

Movies.propTypes = {
  loadMoreMovies: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
};
