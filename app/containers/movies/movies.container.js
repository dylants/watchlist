import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import { loadMoviesQueue } from '../../actions/movie.actions';

class MoviesContainer extends Component {
  componentWillMount() {
    // to start, let's load some movies
    this.props.loadMoviesQueue();
  }

  render() {
    return (
      <Movies
        loadMoreMovies={this.props.loadMoviesQueue}
        movies={this.props.moviesState.moviesQueue}
      />
    );
  }
}

MoviesContainer.propTypes = {
  moviesState: PropTypes.object.isRequired,
  loadMoviesQueue: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    moviesState: state.moviesState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadMoviesQueue }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoviesContainer);
