import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import * as MovieActions from '../../actions/movie.actions';

function MoviesContainer({ moviesState, movieActions }) {
  return (
    <Movies loadMovies={movieActions.loadMovies} movies={moviesState.movies} />
  );
}

MoviesContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  movieActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.movies,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    movieActions: bindActionCreators(MovieActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoviesContainer);
