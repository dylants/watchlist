import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import MovieContainer from '../../containers/movie/movie.container';
import {
  loadInitialDismissedMovies,
  loadDismissedMovies,
} from '../../actions/dismissed-movies.actions';

class DismissedMoviesContainer extends Component {
  componentWillMount() {
    this.props.loadInitialDismissedMovies();
  }

  render() {
    const { dismissedMovies, isWaiting, hasMoreDismissedMovies } = this.props.moviesState;

    return (
      <Movies
        loadMoreMovies={this.props.loadDismissedMovies}
        movies={dismissedMovies}
        MovieContainer={MovieContainer}
        isWaiting={isWaiting}
        hasMore={hasMoreDismissedMovies}
      />
    );
  }
}

DismissedMoviesContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  loadInitialDismissedMovies: PropTypes.func.isRequired,
  loadDismissedMovies: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.moviesState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInitialDismissedMovies, loadDismissedMovies }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DismissedMoviesContainer);
