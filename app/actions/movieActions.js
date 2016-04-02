import { createAction } from 'redux-actions';

import {
  LOADING_MOVIES,
  MOVIES_LOADED,
  FAILED_LOADING_MOVIES,
} from '../constants/movieActionTypes';

const moviesLoading = createAction(LOADING_MOVIES);

function failedLoadingMovies(error) {
  return {
    type: FAILED_LOADING_MOVIES,
    error,
  };
}

function moviesLoaded(movies) {
  return {
    type: MOVIES_LOADED,
    movies,
  };
}

export function loadMovies() {
  return dispatch => {
    dispatch(moviesLoading());

    return fetch('/api/movies', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => dispatch(moviesLoaded(json)))
    .catch((error) => dispatch(failedLoadingMovies(error)));
  };
}
