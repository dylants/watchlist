import {
  LOADING_MOVIES,
  MOVIES_QUEUE_LOADED,
  SAVED_MOVIES_LOADED,
  DISMISSED_MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
  SAVING_MOVIE,
  SAVED_MOVIE,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  UNDISMISSED_MOVIE,
  UNDISMISSING_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../action-types/movie.action-types';

const initialState = {
  isWaiting: false,
  moviesQueueSkip: 0,
  moviesQueueLimit: 20,
  moviesQueue: [],
  savedMoviesSkip: 0,
  savedMoviesLimit: 20,
  savedMovies: [],
  dismissedMoviesSkip: 0,
  dismissedMoviesLimit: 20,
  dismissedMovies: [],
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
    case SAVED_MOVIES_LOADED:
      return Object.assign({}, state, {
        isWaiting: false,
        savedMoviesSkip: state.savedMoviesSkip + state.savedMoviesLimit,
        savedMovies: action.savedMovies,
        error: null,
      });
    case DISMISSED_MOVIES_LOADED:
      return Object.assign({}, state, {
        isWaiting: false,
        dismissedMoviesSkip: state.dismissedMoviesSkip + state.dismissedMoviesLimit,
        dismissedMovies: action.dismissedMovies,
        error: null,
      });
    case MOVIES_ALREADY_LOADED:
      return Object.assign({}, state, {
        isWaiting: false,
        error: null,
      });
    case FAILED_LOADING_MOVIES:
      return Object.assign({}, state, {
        isWaiting: false,
        error: action.error,
      });
    case SAVING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case SAVED_MOVIE:
      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: action.moviesQueue,
        savedMovies: action.savedMovies,
        error: null,
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
        savedMovies: action.savedMovies,
        dismissedMovies: action.dismissedMovies,
        error: null,
      });
    case UNDISMISSING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case UNDISMISSED_MOVIE:
      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: action.moviesQueue,
        savedMovies: action.savedMovies,
        dismissedMovies: action.dismissedMovies,
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
