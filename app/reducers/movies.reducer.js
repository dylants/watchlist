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
} from '../constants/action-types';

const initialState = {
  isWaiting: false,
  moviesQueueSkip: 0,
  moviesQueueLimit: 20,
  moviesQueue: [],
  hasMoreMoviesQueue: true,
  savedMoviesSkip: 0,
  savedMoviesLimit: 20,
  savedMovies: [],
  hasMoreSavedMovies: true,
  dismissedMoviesSkip: 0,
  dismissedMoviesLimit: 20,
  dismissedMovies: [],
  hasMoreDismissedMovies: true,
  error: null,
};

export default function movies(state = initialState, action) {
  switch (action.type) {
    case LOADING_MOVIES:
      return Object.assign({}, state, {
        isWaiting: true,
        error: null,
      });
    case MOVIES_QUEUE_LOADED: {
      // check to see if we have any movies left by verifying if the amount of
      // movies we requested was equal to the amount that we received
      let hasMoreMoviesQueue = true;
      if (state.moviesQueueLimit !== action.moviesQueue.length) {
        hasMoreMoviesQueue = false;
      }

      // update the movies queue by combining the inbound movies with
      // the movies we already have stored
      const updatedMovies = unionBy(state.moviesQueue, action.moviesQueue, 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        // increase the skip by the amount we've requested
        moviesQueueSkip: state.moviesQueueSkip + state.moviesQueueLimit,
        moviesQueue: updatedMovies,
        hasMoreMoviesQueue,
        error: null,
      });
    }
    case SAVED_MOVIES_LOADED: {
      // check to see if we have any movies left by verifying if the amount of
      // movies we requested was equal to the amount that we received
      let hasMoreSavedMovies = true;
      if (state.savedMoviesLimit !== action.savedMovies.length) {
        hasMoreSavedMovies = false;
      }

      // update the saved movies by combining the inbound movies with
      // the movies we already have stored
      const updatedMovies = unionBy(state.savedMovies, action.savedMovies, 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        savedMoviesSkip: state.savedMoviesSkip + state.savedMoviesLimit,
        savedMovies: updatedMovies,
        hasMoreSavedMovies,
        error: null,
      });
    }
    case DISMISSED_MOVIES_LOADED: {
      // check to see if we have any movies left by verifying if the amount of
      // movies we requested was equal to the amount that we received
      let hasMoreDismissedMovies = true;
      if (state.dismissedMoviesLimit !== action.dismissedMovies.length) {
        hasMoreDismissedMovies = false;
      }

      // update the dismissed movies by combining the inbound movies with
      // the movies we already have stored
      const updatedMovies = unionBy(state.dismissedMovies, action.dismissedMovies, 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        dismissedMoviesSkip: state.dismissedMoviesSkip + state.dismissedMoviesLimit,
        dismissedMovies: updatedMovies,
        hasMoreDismissedMovies,
        error: null,
      });
    }
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
      const { moviesQueue, savedMovies, moviesQueueSkip } = state;

      // remove the movie from our movies queue, and add it to the saved movies
      const updatedMoviesQueue = differenceBy(moviesQueue, [action.updatedMovie], 'id');
      const updatedSavedMovies = unionBy(savedMovies, [action.updatedMovie], 'id');

      // since we removed a movie from the movies queue, we decrement the
      // movies queue skip by 1 (unless it's already at 0)
      const updatedMoviesQueueSkip = moviesQueueSkip === 0 ? 0 : moviesQueueSkip - 1;

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueueSkip: updatedMoviesQueueSkip,
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
      const {
        moviesQueue,
        savedMovies,
        dismissedMovies,
        moviesQueueSkip,
        savedMoviesSkip,
      } = state;

      // remove the movie from either the movies queue or saved movies, and
      // add the movie to our dismissed movies. also update the skip for the
      // appropriate queue
      let updatedMoviesQueue;
      let updatedMoviesQueueSkip;
      let updatedSavedMovies;
      let updatedSavedMoviesSkip;
      // where are you movie?
      if (find(moviesQueue, ['id', action.updatedMovie.id])) {
        // you're in the movies queue!
        updatedMoviesQueue = differenceBy(moviesQueue, [action.updatedMovie], 'id');
        updatedMoviesQueueSkip = moviesQueueSkip === 0 ? 0 : moviesQueueSkip - 1;
        updatedSavedMovies = savedMovies;
        updatedSavedMoviesSkip = savedMoviesSkip;
      } else {
        // you're in the saved movies!
        updatedMoviesQueue = moviesQueue;
        updatedMoviesQueueSkip = moviesQueueSkip;
        updatedSavedMovies = differenceBy(savedMovies, [action.updatedMovie], 'id');
        updatedSavedMoviesSkip = savedMoviesSkip === 0 ? 0 : savedMoviesSkip - 1;
      }
      const updatedDismissedMovies = unionBy(dismissedMovies, [action.updatedMovie], 'id');

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueueSkip: updatedMoviesQueueSkip,
        moviesQueue: updatedMoviesQueue,
        savedMoviesSkip: updatedSavedMoviesSkip,
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
      const { moviesQueue, savedMovies, dismissedMovies, dismissedMoviesSkip } = state;

      // remove the movie from the dismissed movies and add it to either the
      // movies queue or the saved movies based on the saved flag
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

      // since we removed a movie from the dismissed movies, we must update
      // the dismissed movies skip appropriately
      const updatedDismissedMoviesSkip = dismissedMoviesSkip === 0 ? 0 :
        dismissedMoviesSkip - 1;

      return Object.assign({}, state, {
        isWaiting: false,
        moviesQueue: updatedMoviesQueue,
        savedMovies: updatedSavedMovies,
        dismissedMoviesSkip: updatedDismissedMoviesSkip,
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
