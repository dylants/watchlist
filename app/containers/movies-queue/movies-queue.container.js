import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import { loadInitialMoviesQueue, loadMoviesQueue } from '../../actions/movie.actions';
import { MOVIES_QUEUE } from '../../constants/movie-types';

class MoviesQueueContainer extends Component {
  componentWillMount() {
    this.props.loadInitialMoviesQueue();
  }

  render() {
    const movieState = this.props.movieGroupsState[MOVIES_QUEUE];
    const { loading, movies, hasMoreMovies } = movieState;

    return (
      <Movies
        loadMoreMovies={this.props.loadMoviesQueue}
        movies={movies}
        MovieContainer={MovieContainer}
        isWaiting={loading}
        hasMore={hasMoreMovies}
      />
    );
  }
}

MoviesQueueContainer.propTypes = {
  movieGroupsState: PropTypes.object.isRequired,
  loadInitialMoviesQueue: PropTypes.func.isRequired,
  loadMoviesQueue: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    movieGroupsState: state.movieGroupsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialMoviesQueue, loadMoviesQueue }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoviesQueueContainer);
