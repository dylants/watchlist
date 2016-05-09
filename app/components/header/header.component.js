import React, { PropTypes } from 'react';

import style from './header.component.scss';

export default function Header(props) {
  return (
    <div className={style.header}>
      <div className={style.element} onClick={props.clickQueue}>Queue</div>
      <div className={style.element} onClick={props.clickSaved}>Saved</div>
      <div className={style.element} onClick={props.clickDismissed}>Dismissed</div>
    </div>
  );
}

Header.propTypes = {
  clickQueue: PropTypes.func.isRequired,
  clickSaved: PropTypes.func.isRequired,
  clickDismissed: PropTypes.func.isRequired,
};
