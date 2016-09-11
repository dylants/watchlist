import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import { loadInitialSavedMovies, loadSavedMovies } from '../../actions/movie.actions';
import { SAVED_MOVIES } from '../../constants/movie-types';

class SavedMoviesContainer extends Component {
  componentWillMount() {
    this.props.loadInitialSavedMovies();
  }

  render() {
    const movieState = this.props.movieGroupsState[SAVED_MOVIES];
    const { loading, movies, hasMoreMovies } = movieState;

    return (
      <Movies
        loadMoreMovies={this.props.loadSavedMovies}
        movies={movies}
        MovieContainer={MovieContainer}
        isWaiting={loading}
        hasMore={hasMoreMovies}
      />
    );
  }
}

SavedMoviesContainer.propTypes = {
  movieGroupsState: PropTypes.object.isRequired,
  loadInitialSavedMovies: PropTypes.func.isRequired,
  loadSavedMovies: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    movieGroupsState: state.movieGroupsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialSavedMovies, loadSavedMovies }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedMoviesContainer);
