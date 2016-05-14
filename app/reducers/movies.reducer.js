import { differenceBy, unionBy, find } from 'lodash';

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
    case SAVED_MOVIE: {
      // remove the movie from our movies queue, and add it to the saved movies
      const { moviesQueue, savedMovies } = state;
      const updatedMoviesQueue = differenceBy(moviesQueue, [action.updatedMovie], 'id');
      const updatedSavedMovies = unionBy(savedMovies, [action.updatedMovie], 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: updatedMoviesQueue,
        savedMovies: updatedSavedMovies,
        error: null,
      });
    }

    case DISMISSING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case DISMISSED_MOVIE: {
      // remove the movie from either the movies queue or saved movies, and
      // add the movie to our dismissed movies
      const { moviesQueue, savedMovies, dismissedMovies } = state;

      let updatedMoviesQueue;
      let updatedSavedMovies;
      // where are you movie?
      if (find(moviesQueue, ['id', action.updatedMovie.id])) {
        // you're in the movies queue!
        updatedMoviesQueue = differenceBy(moviesQueue, [action.updatedMovie], 'id');
        updatedSavedMovies = savedMovies;
      } else {
        // you're in the saved movies!
        updatedMoviesQueue = moviesQueue;
        updatedSavedMovies = differenceBy(savedMovies, [action.updatedMovie], 'id');
      }
      const updatedDismissedMovies = unionBy(dismissedMovies, [action.updatedMovie], 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: updatedMoviesQueue,
        savedMovies: updatedSavedMovies,
        dismissedMovies: updatedDismissedMovies,
        error: null,
      });
    }
    case UNDISMISSING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case UNDISMISSED_MOVIE: {
      // remove the movie from the dismissed movies and add it to either the
      // movies queue or the saved movies based on the saved flag
      // remove the movie from either the movies queue or saved movies, and
      // add the movie to our dismissed movies
      const { moviesQueue, savedMovies, dismissedMovies } = state;

      let updatedMoviesQueue;
      let updatedSavedMovies;
      // was this movie saved before it was dismissed?
      if (action.updatedMovie.saved) {
        updatedMoviesQueue = moviesQueue;
        updatedSavedMovies = unionBy(savedMovies, [action.updatedMovie], 'id');
      } else {
        updatedMoviesQueue = unionBy(moviesQueue, [action.updatedMovie], 'id');
        updatedSavedMovies = savedMovies;
      }
      const updatedDismissedMovies = differenceBy(dismissedMovies, [action.updatedMovie], 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: updatedMoviesQueue,
        savedMovies: updatedSavedMovies,
        dismissedMovies: updatedDismissedMovies,
        error: null,
      });
    }
    case FAILED_UPDATING_MOVIE:
      return Object.assign({}, state, {
        isWaiting: false,
        error: action.error,
      });
    default:
      return state;
  }
}
