import React, { PropTypes } from 'react';

import style from './header.component.scss';

export default function Header(props) {
  let queueClass;
  let savedClass;
  let dismissedClass;

  // default each class to the basic element styling
  queueClass = savedClass = dismissedClass = style.element;

  // assign a selected class based on who's selected
  switch (props.selected) {
    case 'queue':
      queueClass = `${queueClass} ${style.selected}`;
      break;
    case 'saved':
      savedClass = `${savedClass} ${style.selected}`;
      break;
    case 'dismissed':
      dismissedClass = `${dismissedClass} ${style.selected}`;
      break;
    default:
  }

  return (
    <div className={style.header}>
      <div className={queueClass} onClick={props.clickQueue}>Queue</div>
      <div className={savedClass} onClick={props.clickSaved}>Saved</div>
      <div className={dismissedClass} onClick={props.clickDismissed}>Dismissed</div>
    </div>
  );
}

Header.propTypes = {
  selected: PropTypes.string.isRequired,
  clickQueue: PropTypes.func.isRequired,
  clickSaved: PropTypes.func.isRequired,
  clickDismissed: PropTypes.func.isRequired,
};
