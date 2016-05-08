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
  FAILED_LOADING_MOVIES,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../constants/movie.action-types';

const loadingMovies = createAction(LOADING_MOVIES);

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

export function loadMoviesQueue() {
  return (dispatch, getState) => {
    dispatch(loadingMovies());

    const moviesState = getState().moviesState;
    const movies = moviesState.moviesQueue;
    const skip = moviesState.moviesQueueSkip;
    const limit = moviesState.moviesQueueLimit;

    const uri = `/api/secure/movies?saved=false&skip=${skip}&limit=${limit}`;
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'GET',
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(response => response.json())
      .then(newMovies => {
        const updatedMovies = movies.concat(newMovies);
        return dispatch(moviesQueueLoaded(updatedMovies));
      })
      .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
  };
}

const dismissingMovie = createAction(DISMISSING_MOVIE);

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
