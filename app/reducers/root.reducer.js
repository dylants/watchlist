import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import loginReducer from './login.reducer';
import moviesReducer from './movies.reducer';

export default combineReducers({
  routing,
  loginState: loginReducer,
  moviesState: moviesReducer,
});
