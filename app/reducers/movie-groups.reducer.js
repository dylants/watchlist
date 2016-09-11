import { cloneDeep, find } from 'lodash';

import moviesReducer from './movies.reducer';

import {
  LOADING_MOVIES,
  MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
  UPDATING_MOVIE,
  FAILED_UPDATING_MOVIE,
  SAVED_MOVIE,
  DISMISSED_MOVIE,
  UNDISMISSED_MOVIE,
  ADD_MOVIE,
  REMOVE_MOVIE,
} from '../constants/action-types';

const initialState = {
  moviesQueue: moviesReducer(undefined, {}),
  savedMovies: moviesReducer(undefined, {}),
  dismissedMovies: moviesReducer(undefined, {}),
};

export default function movieGroupsReducer(state = initialState, action) {
  switch (action.type) {
    // All of these actions are delegated to the child reducer (moviesReducer)
    case LOADING_MOVIES:
    case MOVIES_ALREADY_LOADED:
    case FAILED_LOADING_MOVIES:
    case MOVIES_LOADED:
    case UPDATING_MOVIE:
    case FAILED_UPDATING_MOVIE: {
      const updatedState = cloneDeep(state);
      const { movieType } = action;
      let movieGroup = updatedState[movieType];

      movieGroup = moviesReducer(movieGroup, action);

      updatedState[movieType] = movieGroup;

      return updatedState;
    }

    /* Begin actions handled by this reducer */

    case SAVED_MOVIE: {
      const updatedState = cloneDeep(state);
      const { moviesQueue, savedMovies } = updatedState;
      const { updatedMovie } = action;

      // add the movie to the saved movies list
      updatedState.savedMovies = moviesReducer(savedMovies, {
        type: ADD_MOVIE,
        updatedMovie,
      });

      // remove the movie from the movies queue
      updatedState.moviesQueue = moviesReducer(moviesQueue, {
        type: REMOVE_MOVIE,
        updatedMovie,
      });

      return updatedState;
    }
    case DISMISSED_MOVIE: {
      const updatedState = cloneDeep(state);
      const { moviesQueue, savedMovies, dismissedMovies } = updatedState;
      const { updatedMovie } = action;

      // remove the movie from either the moviesQueue or savedMovies
      // where are you movie?
      if (find(moviesQueue.movies, ['id', updatedMovie.id])) {
        // you're in the movies queue!
        updatedState.moviesQueue = moviesReducer(moviesQueue, {
          type: REMOVE_MOVIE,
          updatedMovie,
        });
      } else {
        // you're in the saved movies!
        updatedState.savedMovies = moviesReducer(savedMovies, {
          type: REMOVE_MOVIE,
          updatedMovie,
        });
      }

      // add the movie to the dismissedMovies
      updatedState.dismissedMovies = moviesReducer(dismissedMovies, {
        type: ADD_MOVIE,
        updatedMovie,
      });

      return updatedState;
    }
    case UNDISMISSED_MOVIE: {
      const updatedState = cloneDeep(state);
      const { moviesQueue, savedMovies, dismissedMovies } = updatedState;
      const { updatedMovie } = action;

      // remove the movie from the dismissedMovies
      updatedState.dismissedMovies = moviesReducer(dismissedMovies, {
        type: REMOVE_MOVIE,
        updatedMovie,
      });

      // add the movie to either the moviesQueue or savedMovies based on saved flag
      if (updatedMovie.saved) {
        updatedState.savedMovies = moviesReducer(savedMovies, {
          type: ADD_MOVIE,
          updatedMovie,
        });
      } else {
        updatedState.moviesQueue = moviesReducer(moviesQueue, {
          type: ADD_MOVIE,
          updatedMovie,
        });
      }

      return updatedState;
    }
    default:
      return state;
  }
}
