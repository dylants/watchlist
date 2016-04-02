import React, { Component, PropTypes } from 'react';

export default class Movie extends Component {
  render() {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}

Movie.propTypes = {
  title: PropTypes.string.isRequired,
};
