import React, { PropTypes } from 'react';

import HeaderContainer from '../header/header.container';

import style from './app.container.scss';

export default function App({ children, location }) {
  // don't show the header on the login page
  let header;
  if (location.pathname !== '/login') {
    header = (
      <HeaderContainer location={location} />
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
  location: PropTypes.object.isRequired,
};
