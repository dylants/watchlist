import { createAction } from 'redux-actions';
import { remove } from 'lodash';

import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  LOADING_MOVIES,
  MOVIES_QUEUE_LOADED,
  SAVED_MOVIES_LOADED,
  DISMISSED_MOVIES_LOADED,
  MOVIES_ALREADY_LOADED,
  FAILED_LOADING_MOVIES,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../constants/movie.action-types';

const loadingMovies = createAction(LOADING_MOVIES);
const moviesAlreadyLoaded = createAction(MOVIES_ALREADY_LOADED);
const dismissingMovie = createAction(DISMISSING_MOVIE);

function failedLoadingMovies(error) {
  return {
    type: FAILED_LOADING_MOVIES,
    error,
  };
}

function moviesQueueLoaded(moviesQueue) {
  return {
    type: MOVIES_QUEUE_LOADED,
    moviesQueue,
  };
}

function savedMoviesLoaded(savedMovies) {
  return {
    type: SAVED_MOVIES_LOADED,
    savedMovies,
  };
}

function dismissedMoviesLoaded(dismissedMovies) {
  return {
    type: DISMISSED_MOVIES_LOADED,
    dismissedMovies,
  };
}

function dismissedMovie(moviesQueue) {
  return {
    type: DISMISSED_MOVIE,
    moviesQueue,
  };
}

function failedUpdatingMovie(error) {
  return {
    type: FAILED_UPDATING_MOVIE,
    error,
  };
}

function fetchMoviesQueue(dispatch, getState) {
  dispatch(loadingMovies());

  const { moviesQueue, moviesQueueSkip, moviesQueueLimit } = getState().moviesState;

  const uri = `/api/secure/movies?saved=false&skip=${moviesQueueSkip}` +
    `&limit=${moviesQueueLimit}`;
  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'GET',
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(newMovies => {
      const updatedMovies = moviesQueue.concat(newMovies);
      return dispatch(moviesQueueLoaded(updatedMovies));
    })
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
}

function fetchSavedMovies(dispatch, getState) {
  dispatch(loadingMovies());

  const { savedMovies, savedMoviesSkip, savedMoviesLimit } = getState().moviesState;

  const uri = `/api/secure/movies?saved=true&skip=${savedMoviesSkip}` +
    `&limit=${savedMoviesLimit}`;
  const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
    method: 'GET',
  });

  return fetch(uri, options)
    .then(checkHttpStatus)
    .then(response => response.json())
    .then(newMovies => {
      const updatedMovies = savedMovies.concat(newMovies);
      return dispatch(savedMoviesLoaded(updatedMovies));
    })
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
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
      const updatedMovies = dismissedMovies.concat(newMovies);
      return dispatch(dismissedMoviesLoaded(updatedMovies));
    })
    .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
}

export function loadInitialMoviesQueue() {
  return (dispatch, getState) => {
    const { moviesQueue } = getState().moviesState;

    // check to see if we have any movies, and if so, stop here
    if (moviesQueue && moviesQueue.length > 0) {
      return dispatch(moviesAlreadyLoaded());
    }

    return fetchMoviesQueue(dispatch, getState);
  };
}

export function loadMoviesQueue() {
  return fetchMoviesQueue;
}

export function loadInitialSavedMovies() {
  return (dispatch, getState) => {
    const { savedMovies } = getState().moviesState;

    // check to see if we have any movies, and if so, stop here
    if (savedMovies && savedMovies.length > 0) {
      return dispatch(moviesAlreadyLoaded());
    }

    return fetchSavedMovies(dispatch, getState);
  };
}

export function loadSavedMovies() {
  return fetchSavedMovies;
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

export function dismissMovie(movieId) {
  return (dispatch, getState) => {
    dispatch(dismissingMovie());

    const moviesState = getState().moviesState;
    const moviesQueue = moviesState.moviesQueue;

    const uri = `/api/secure/movies/${movieId}`;
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'PATCH',
      body: JSON.stringify({
        dismissed: true,
      }),
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(() => {
        // remove the movie from our movies queue locally
        remove(moviesQueue, (movie) => movieId === movie.id);
        dispatch(dismissedMovie(moviesQueue));
      })
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}
