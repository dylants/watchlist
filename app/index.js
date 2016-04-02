import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

import configureStore from './store/configureStore';
import App from './containers/App';
import MoviesContainer from './containers/MoviesContainer';

const store = configureStore();
const history = createHistory();

syncReduxAndRouter(history, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={MoviesContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
