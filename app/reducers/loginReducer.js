import {
  LOGIN_INITIATED,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../constants/loginActionTypes';

const initialState = {
  isWaiting: false,
  user: null,
  error: null,
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_INITIATED:
      return Object.assign({}, state, {
        isWaiting: true,
        user: null,
        error: null,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isWaiting: false,
        user: action.user,
        error: null,
      });
    case LOGIN_ERROR:
      return Object.assign({}, state, {
        isWaiting: false,
        user: null,
        error: action.error,
      });
    default:
      return state;
  }
}
