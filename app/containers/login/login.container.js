import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Login from '../../components/login/login.component';
import * as LoginActions from '../../actions/login.actions';

function LoginContainer({ loginState, loginActions }) {
  return (
    <Login {...loginState} {...loginActions} />
  );
}

LoginContainer.propTypes = {
  loginState: PropTypes.object.isRequired,
  loginActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    loginState: state.loginState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(LoginActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginContainer);
