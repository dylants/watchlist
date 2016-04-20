import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Movie from '../../components/Movie';

function MovieContainer({ movie }) {
  return (
    <Movie {...movie} />
  );
}

MovieContainer.propTypes = {
  movie: PropTypes.object.isRequired,
};

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps() {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovieContainer);
