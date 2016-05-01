import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';

const logger = createLogger({
  // only log when in development environment
  predicate: () => process.env.NODE_ENV === 'development',
});

function configureStore(initialState, history) {
  const middleware = applyMiddleware(
    thunkMiddleware,
    routerMiddleware(history),
    logger,
  );

  const store = createStore(rootReducer, initialState, middleware);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default configureStore;
