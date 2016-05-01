import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import loginReducer from './loginReducer';
import movies from './movies';

export default combineReducers({
  routing,
  loginState: loginReducer,
  movies,
});
