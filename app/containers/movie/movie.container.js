import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movie from '../../components/movie/movie.component';
import * as MovieActions from '../../actions/movie.actions';

function MovieContainer({ movie, movieActions }) {
  const {
    saveMovie,
    dismissMovie,
    undismissMovie,
  } = movieActions;

  return (
    <Movie
      {...movie}
      saveMovie={saveMovie}
      dismissMovie={dismissMovie}
      undismissMovie={undismissMovie}
    />
  );
}

MovieContainer.propTypes = {
  movie: PropTypes.object.isRequired,
  movieActions: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    movieActions: bindActionCreators(MovieActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(MovieContainer);
