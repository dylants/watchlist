import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import { loadInitialSavedMovies, loadSavedMovies } from '../../actions/saved-movies.actions';

class SavedMoviesContainer extends Component {
  componentWillMount() {
    this.props.loadInitialSavedMovies();
  }

  render() {
    const { savedMovies, isWaiting, hasMoreSavedMovies } = this.props.moviesState;
    return (
      <Movies
        loadMoreMovies={this.props.loadSavedMovies}
        movies={savedMovies}
        MovieContainer={MovieContainer}
        isWaiting={isWaiting}
        hasMore={hasMoreSavedMovies}
      />
    );
  }
}

SavedMoviesContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  loadInitialSavedMovies: PropTypes.func.isRequired,
  loadSavedMovies: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.moviesState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialSavedMovies, loadSavedMovies }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedMoviesContainer);
