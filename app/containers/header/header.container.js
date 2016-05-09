import React from 'react';
import { browserHistory } from 'react-router';

import Header from '../../components/header/header.component';

export default function HeaderContainer() {
  return (
    <Header
      clickQueue={() => browserHistory.push('/')}
      clickSaved={() => browserHistory.push('/saved')}
      clickDismissed={() => browserHistory.push('/dismissed')}
    />
  );
}

HeaderContainer.propTypes = {};
