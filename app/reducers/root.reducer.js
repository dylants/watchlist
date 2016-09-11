import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import loginReducer from './login.reducer';
import movieGroupsReducer from './movie-groups.reducer';

export default combineReducers({
  routing,
  loginState: loginReducer,
  movieGroupsState: movieGroupsReducer,
});
