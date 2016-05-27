import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  LOADING_MOVIES,
  SAVED_MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
} from '../constants/action-types';

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

function savedMoviesLoaded(savedMovies) {
  return {
    type: SAVED_MOVIES_LOADED,
    savedMovies,
  };
}

function fetchSavedMovies(dispatch, getState) {
  dispatch(loadingMovies());

  const { savedMoviesSkip, savedMoviesLimit } = getState().moviesState;

  const uri = `/api/secure/movies?saved=true&skip=${savedMoviesSkip}` +
    `&limit=${savedMoviesLimit}`;
  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'GET',
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(newMovies => dispatch(savedMoviesLoaded(newMovies)))
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
}

export function loadInitialSavedMovies() {
  return (dispatch, getState) => {
    const { savedMovies, hasMoreSavedMovies } = getState().moviesState;

    // check to see if we have any movies, and if so, stop here
    if (savedMovies && savedMovies.length > 0) {
      return dispatch(moviesAlreadyLoaded());
    }

    // if we have no more movies, stop here
    if (!hasMoreSavedMovies) {
      return dispatch(moviesAlreadyLoaded());
    }


    return fetchSavedMovies(dispatch, getState);
  };
}

export function loadSavedMovies() {
  return fetchSavedMovies;
}
