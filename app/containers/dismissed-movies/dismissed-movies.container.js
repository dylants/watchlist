import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import {
  loadInitialDismissedMovies,
  loadDismissedMovies,
} from '../../actions/movie.actions';
import { DISMISSED_MOVIES } from '../../constants/movie-types';

class DismissedMoviesContainer extends Component {
  componentWillMount() {
    this.props.loadInitialDismissedMovies();
  }

  render() {
    const movieState = this.props.movieGroupsState[DISMISSED_MOVIES];
    const { loading, movies, hasMoreMovies } = movieState;

    return (
      <Movies
        loadMoreMovies={this.props.loadDismissedMovies}
        movies={movies}
        MovieContainer={MovieContainer}
        isWaiting={loading}
        hasMore={hasMoreMovies}
      />
    );
  }
}

DismissedMoviesContainer.propTypes = {
  movieGroupsState: PropTypes.object.isRequired,
  loadInitialDismissedMovies: PropTypes.func.isRequired,
  loadDismissedMovies: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    movieGroupsState: state.movieGroupsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialDismissedMovies, loadDismissedMovies }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DismissedMoviesContainer);
