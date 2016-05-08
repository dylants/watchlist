import {
  LOADING_MOVIES,
  MOVIES_QUEUE_LOADED,
  FAILED_LOADING_MOVIES,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../constants/movie.action-types';

const initialState = {
  isWaiting: false,
  moviesQueueSkip: 0,
  moviesQueueLimit: 20,
  moviesQueue: [],
  error: null,
};

export default function movies(state = initialState, action) {
  switch (action.type) {
    case LOADING_MOVIES:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case MOVIES_QUEUE_LOADED:
      return Object.assign({}, state, {
        isWaiting: false,
        // increase the skip by the amount we've requested
        moviesQueueSkip: state.moviesQueueSkip + state.moviesQueueLimit,
        moviesQueue: action.moviesQueue,
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
        moviesQueue: action.moviesQueue,
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
