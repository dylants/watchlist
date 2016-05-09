import React, { PropTypes } from 'react';

import HeaderContainer from '../header/header.container';

import style from './app.container.scss';

// function input is shorthand for const { children } = this.props
export default function App({ children }) {
  return (
    <div className={style.app}>
      <HeaderContainer />
      <div className={style.main}>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.any,
};
