import React, { PropTypes } from 'react';

import './test-app.container.scss';

export default function TestApp({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

TestApp.propTypes = {
  children: PropTypes.any,
};
