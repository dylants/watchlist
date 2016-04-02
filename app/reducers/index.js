import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';
import movies from './movies';

export default combineReducers({
  routing,
  movies,
});
