import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

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
} from '../constants/action-types';

import {
  MOVIES_QUEUE,
  SAVED_MOVIES,
  DISMISSED_MOVIES,
} from '../constants/movie-types';

function loadingMovies(movieType) {
  return {
    type: LOADING_MOVIES,
    movieType,
  };
}

function moviesAlreadyLoaded(movieType) {
  return {
    type: MOVIES_ALREADY_LOADED,
    movieType,
  };
}

function failedLoadingMovies(error, movieType) {
  return {
    type: FAILED_LOADING_MOVIES,
    error,
    movieType,
  };
}

function moviesLoaded(movieType, movies) {
  return {
    type: MOVIES_LOADED,
    movieType,
    movies,
  };
}

function updatingMovie(movieType) {
  return {
    type: UPDATING_MOVIE,
    movieType,
  };
}

function failedUpdatingMovie(error, movieType) {
  return {
    type: FAILED_UPDATING_MOVIE,
    error,
    movieType,
  };
}

function savedMovie(updatedMovie) {
  return {
    type: SAVED_MOVIE,
    updatedMovie,
  };
}

function dismissedMovie(updatedMovie) {
  return {
    type: DISMISSED_MOVIE,
    updatedMovie,
  };
}

function undismissedMovie(updatedMovie) {
  return {
    type: UNDISMISSED_MOVIE,
    updatedMovie,
  };
}

function fetchMovies(movieType, uri, dispatch) {
  dispatch(loadingMovies(movieType));

  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'GET',
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(newMovies => dispatch(moviesLoaded(movieType, newMovies)))
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies, movieType));
}

function loadInitialMovies(movieType, uri, dispatch, getState) {
  const { movies, hasMoreMovies } = getState().movieGroupsState[movieType];

  // check to see if we have any movies, and if so, stop here
  if (movies && movies.length > 0) {
    return dispatch(moviesAlreadyLoaded(movieType));
  }

  // if we have no more movies, stop here
  if (!hasMoreMovies) {
    return dispatch(moviesAlreadyLoaded(movieType));
  }

  return fetchMovies(movieType, uri, dispatch);
}

function getUri(movieType, getState) {
  const { skip, limit } = getState().movieGroupsState[movieType];

  if (movieType === MOVIES_QUEUE) {
    return `/api/secure/movies?saved=false&skip=${skip}&limit=${limit}`;
  } else if (movieType === SAVED_MOVIES) {
    return `/api/secure/movies?saved=true&skip=${skip}&limit=${limit}`;
  } else {
    return `/api/secure/movies?dismissed=true&skip=${skip}&limit=${limit}`;
  }
}

function updateMovie(movieType, movieId, body, successFunction, dispatch) {
  dispatch(updatingMovie(movieType));

  const uri = `/api/secure/movies/${movieId}`;
  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(updatedMovie => dispatch(successFunction(updatedMovie)))
    .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie, movieType));
}

/* ------------------------------------------------------------- *
 * ------------------- EXPORTED FUNCTIONS ---------------------- *
 * ------------------------------------------------------------- */

export function loadMoviesQueue() {
  return (dispatch, getState) => {
    const uri = getUri(MOVIES_QUEUE, getState);

    return fetchMovies(MOVIES_QUEUE, uri, dispatch);
  };
}

export function loadInitialMoviesQueue() {
  return (dispatch, getState) => {
    const uri = getUri(MOVIES_QUEUE, getState);

    return loadInitialMovies(MOVIES_QUEUE, uri, dispatch, getState);
  };
}

export function loadSavedMovies() {
  return (dispatch, getState) => {
    const uri = getUri(SAVED_MOVIES, getState);

    return fetchMovies(SAVED_MOVIES, uri, dispatch);
  };
}

export function loadInitialSavedMovies() {
  return (dispatch, getState) => {
    const uri = getUri(SAVED_MOVIES, getState);

    return loadInitialMovies(SAVED_MOVIES, uri, dispatch, getState);
  };
}

export function loadDismissedMovies() {
  return (dispatch, getState) => {
    const uri = getUri(DISMISSED_MOVIES, getState);

    return fetchMovies(DISMISSED_MOVIES, uri, dispatch);
  };
}

export function loadInitialDismissedMovies() {
  return (dispatch, getState) => {
    const uri = getUri(DISMISSED_MOVIES, getState);

    return loadInitialMovies(DISMISSED_MOVIES, uri, dispatch, getState);
  };
}

export function saveMovie(movieId) {
  return dispatch =>
    updateMovie(SAVED_MOVIES, movieId, { saved: true }, savedMovie, dispatch);
}

export function dismissMovie(movieId) {
  return dispatch =>
    updateMovie(MOVIES_QUEUE, movieId, { dismissed: true }, dismissedMovie, dispatch);
}

export function undismissMovie(movieId) {
  return dispatch =>
    updateMovie(DISMISSED_MOVIES, movieId, { dismissed: false }, undismissedMovie, dispatch);
}
