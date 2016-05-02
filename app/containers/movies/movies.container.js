import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import * as MovieActions from '../../actions/movie.actions';

class MoviesContainer extends Component {
  componentWillMount() {
    // to start, let's load some movies
    this.props.movieActions.loadMovies();
  }

  render() {
    return (
      <Movies
        loadMoreMovies={this.props.movieActions.loadMovies}
        movies={this.props.moviesState.movies}
      />
    );
  }
}

MoviesContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  movieActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.moviesState,
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
