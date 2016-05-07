import {
  LOADING_MOVIES,
  MOVIES_LOADED,
  FAILED_LOADING_MOVIES,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../constants/movie.action-types';

const initialState = {
  isWaiting: false,
  skip: 0,
  limit: 20,
  movies: [],
  error: null,
};

export default function movies(state = initialState, action) {
  switch (action.type) {
    case LOADING_MOVIES:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case MOVIES_LOADED:
      return Object.assign({}, state, {
        isWaiting: false,
        // increase the skip by the amount we've requested
        skip: state.skip + state.limit,
        movies: action.movies,
        error: null,
      });
    case FAILED_LOADING_MOVIES:
      return Object.assign({}, state, {
        isWaiting: false,
        error: action.error,
      });
    case DISMISSING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case DISMISSED_MOVIE:
      return Object.assign({}, state, {
        isWaiting: false,
        movies: action.movies,
        error: null,
      });
    case FAILED_UPDATING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: false,
        error: action.error,
      });
    default:
      return state;
  }
}
