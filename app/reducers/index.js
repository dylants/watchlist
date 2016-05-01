import { combineReducers } from 'redux';
import { routeReducer as routing } from 'redux-simple-router';
import loginReducer from './loginReducer';
import movies from './movies';

export default combineReducers({
  routing,
  loginState: loginReducer,
  movies,
});
