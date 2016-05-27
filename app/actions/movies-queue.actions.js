import { unionBy } from 'lodash';

import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  LOADING_MOVIES,
  MOVIES_QUEUE_LOADED,
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

function moviesQueueLoaded(moviesQueue) {
  return {
    type: MOVIES_QUEUE_LOADED,
    moviesQueue,
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
      const updatedMovies = unionBy(moviesQueue, newMovies, 'id');
      return dispatch(moviesQueueLoaded(updatedMovies));
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
