import React, { Component, PropTypes } from 'react';

import MovieContainer from '../../containers/movie/movie.container';

export default class Movies extends Component {
  componentWillMount() {
    this.props.loadMovies();
  }

  render() {
    const moviesToRender = this.props.movies.map(movie =>
      <MovieContainer key={movie.id} movie={movie} />
    );

    return (
      <div>
        {moviesToRender}
      </div>
    );
  }
}

Movies.propTypes = {
  loadMovies: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
};
