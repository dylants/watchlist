import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import Header from '../../components/header/header.component';

export default function HeaderContainer() {
  let selected;

  // determine the current selected element
  switch (location.pathname) {
    case '/':
      selected = 'queue';
      break;
    case '/saved':
      selected = 'saved';
      break;
    case '/dismissed':
      selected = 'dismissed';
      break;
    default:
  }

  return (
    <Header
      selected={selected}
      clickQueue={() => browserHistory.push('/')}
      clickSaved={() => browserHistory.push('/saved')}
      clickDismissed={() => browserHistory.push('/dismissed')}
    />
  );
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
};
