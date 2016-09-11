import { differenceBy, unionBy } from 'lodash';

import {
  LOADING_MOVIES,
  MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
  UPDATING_MOVIE,
  FAILED_UPDATING_MOVIE,
  ADD_MOVIE,
  REMOVE_MOVIE,
} from '../constants/action-types';

const initialState = {
  loading: false,
  error: null,
  skip: 0,
  limit: 20,
  movies: [],
  hasMoreMovies: true,
};

export default function moviesReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_MOVIES:
    case UPDATING_MOVIE:
      return Object.assign({}, state, {
        loading: true,
        error: null,
      });
    case MOVIES_ALREADY_LOADED:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    case FAILED_LOADING_MOVIES:
    case FAILED_UPDATING_MOVIE:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
      });
    case MOVIES_LOADED: {
      // check to see if we have any movies left by verifying if the amount of movies we requested
      // was equal to the amount that we received
      let hasMoreMovies = true;
      if (state.limit !== action.movies.length) {
        hasMoreMovies = false;
      }

      // update the movies by combining the inbound movies with the movies we have already stored
      const updatedMovies = unionBy(state.movies, action.movies, 'id');

      return Object.assign({}, state, {
        loading: false,
        // increase the skip by the amount we've requested
        skip: state.skip + state.limit,
        movies: updatedMovies,
        hasMoreMovies,
        error: null,
      });
    }
    case ADD_MOVIE: {
      return Object.assign({}, state, {
        loading: false,
        error: null,
        movies: unionBy(state.movies, [action.updatedMovie], 'id'),
      });
    }
    case REMOVE_MOVIE: {
      return Object.assign({}, state, {
        loading: false,
        error: null,
        movies: differenceBy(state.movies, [action.updatedMovie], 'id'),
        // since we removed a movie, we decrement the skip by 1 (unless it's already at 0)
        skip: state.skip === 0 ? 0 : state.skip - 1,
      });
    }
    default:
      return state;
  }
}
