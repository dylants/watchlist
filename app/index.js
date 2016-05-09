import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import App from './containers/app/app.container';
import MoviesQueueContainer from './containers/movies-queue/movies-queue.container';
import SavedMoviesContainer from './containers/saved-movies/saved-movies.container';
import DismissedMoviesContainer from './containers/dismissed-movies/dismissed-movies.container';
import LoginContainer from './containers/login/login.container';

const store = configureStore(undefined, browserHistory);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={MoviesQueueContainer} />
        <Route path="saved" component={SavedMoviesContainer} />
        <Route path="dismissed" component={DismissedMoviesContainer} />
        <Route path="login" component={LoginContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
