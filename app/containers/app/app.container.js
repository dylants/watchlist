import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import HeaderContainer from '../header/header.container';

import style from './app.container.scss';

function App({ children, loginState }) {
  let header;
  if (loginState.user) {
    header = (
      <HeaderContainer />
    );
  }

  return (
    <div className={style.app}>
      {header}
      <div className={style.main}>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.any,
  loginState: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    loginState: state.loginState,
  };
}

export default connect(mapStateToProps)(App);
