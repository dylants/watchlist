import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import { loadInitialMoviesQueue, loadMoviesQueue } from '../../actions/movies-queue.actions';

class MoviesQueueContainer extends Component {
  componentWillMount() {
    this.props.loadInitialMoviesQueue();
  }

  render() {
    const { moviesQueue, isWaiting, hasMoreMoviesQueue } = this.props.moviesState;

    return (
      <Movies
        loadMoreMovies={this.props.loadMoviesQueue}
        movies={moviesQueue}
        MovieContainer={MovieContainer}
        isWaiting={isWaiting}
        hasMore={hasMoreMoviesQueue}
      />
    );
  }
}

MoviesQueueContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  loadInitialMoviesQueue: PropTypes.func.isRequired,
  loadMoviesQueue: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.moviesState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialMoviesQueue, loadMoviesQueue }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoviesQueueContainer);
