import { createAction } from 'redux-actions';
import { checkHttpStatus, handleHttpError } from '../utils';

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

    return fetch('/api/secure/movies', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(json => dispatch(moviesLoaded(json)))
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
  };
}
