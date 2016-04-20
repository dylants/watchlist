import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import './style.scss';

// function input is shorthand for const { children } = this.props
function App({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.any,
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
)(App);
