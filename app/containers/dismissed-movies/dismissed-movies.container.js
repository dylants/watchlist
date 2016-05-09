import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Movies from '../../components/movies/movies.component';
import { loadInitialDismissedMovies, loadDismissedMovies } from '../../actions/movie.actions';

class DismissedMoviesContainer extends Component {
  componentWillMount() {
    this.props.loadInitialDismissedMovies();
  }

  render() {
    return (
      <Movies
        loadMoreMovies={this.props.loadDismissedMovies}
        movies={this.props.moviesState.dismissedMovies}
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
