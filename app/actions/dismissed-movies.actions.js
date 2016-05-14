import { unionBy } from 'lodash';

import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  LOADING_MOVIES,
  DISMISSED_MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
} from '../action-types/movie.action-types';

function loadingMovies() {
  return { type: LOADING_MOVIES };
}

function moviesAlreadyLoaded() {
  return { type: MOVIES_ALREADY_LOADED };
}

function failedLoadingMovies(error) {
  return {
    type: FAILED_LOADING_MOVIES,
    error,
  };
}

function dismissedMoviesLoaded(dismissedMovies) {
  return {
    type: DISMISSED_MOVIES_LOADED,
    dismissedMovies,
  };
}

function fetchDismissedMovies(dispatch, getState) {
  dispatch(loadingMovies());

  const { dismissedMovies, dismissedMoviesSkip, dismissedMoviesLimit } = getState().moviesState;

  const uri = `/api/secure/movies?dismissed=true&skip=${dismissedMoviesSkip}` +
    `&limit=${dismissedMoviesLimit}`;
  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'GET',
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(newMovies => {
      const updatedMovies = unionBy(dismissedMovies, newMovies, 'id');
      return dispatch(dismissedMoviesLoaded(updatedMovies));
    })
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
}

export function loadInitialDismissedMovies() {
  return (dispatch, getState) => {
    const { dismissedMovies } = getState().moviesState;

    // check to see if we have any movies, and if so, stop here
    if (dismissedMovies && dismissedMovies.length > 0) {
      return dispatch(moviesAlreadyLoaded());
    }

    return fetchDismissedMovies(dispatch, getState);
  };
}

export function loadDismissedMovies() {
  return fetchDismissedMovies;
}