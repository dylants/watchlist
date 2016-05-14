import { remove, unionBy } from 'lodash';

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
  SAVING_MOVIE,
  SAVED_MOVIE,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  UNDISMISSED_MOVIE,
  UNDISMISSING_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../action-types/movie.action-types';

function loadingMovies() {
  return { type: LOADING_MOVIES };
}

function moviesAlreadyLoaded() {
  return { type: MOVIES_ALREADY_LOADED };
}

function savingMovie() {
  return { type: SAVING_MOVIE };
}

function dismissingMovie() {
  return { type: DISMISSING_MOVIE };
}

function undismissingMovie() {
  return { type: UNDISMISSING_MOVIE };
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

function savedMovie(moviesQueue, savedMovies) {
  return {
    type: SAVED_MOVIE,
    moviesQueue,
    savedMovies,
  };
}

function dismissedMovie(moviesQueue, savedMovies, dismissedMovies) {
  return {
    type: DISMISSED_MOVIE,
    moviesQueue,
    savedMovies,
    dismissedMovies,
  };
}

function undismissedMovie(moviesQueue, savedMovies, dismissedMovies) {
  return {
    type: UNDISMISSED_MOVIE,
    moviesQueue,
    savedMovies,
    dismissedMovies,
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
      const updatedMovies = unionBy(moviesQueue, newMovies, 'id');
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
      const updatedMovies = unionBy(savedMovies, newMovies, 'id');
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
      const updatedMovies = unionBy(dismissedMovies, newMovies, 'id');
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

export function saveMovie(movieId) {
  return (dispatch, getState) => {
    dispatch(savingMovie());

    const uri = `/api/secure/movies/${movieId}`;
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'PATCH',
      body: JSON.stringify({
        saved: true,
      }),
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(() => {
        const moviesState = getState().moviesState;
        const { moviesQueue, savedMovies } = moviesState;

        // remove the movie from our movies queue locally
        const movedMovie = remove(moviesQueue, movie => movieId === movie.id);
        // add the movie to our local saved movies list
        const updatedSavedMovies = unionBy(savedMovies, movedMovie, 'id');

        dispatch(savedMovie(moviesQueue, updatedSavedMovies));
      })
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}

export function dismissMovie(movieId) {
  return (dispatch, getState) => {
    dispatch(dismissingMovie());

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
        const moviesState = getState().moviesState;
        const { moviesQueue, savedMovies, dismissedMovies } = moviesState;

        // remove the movie from our movies queue locally
        let movedMovie = remove(moviesQueue, movie => movieId === movie.id);
        // if it wasn't in our movies queue, must be in our saved movies
        if (movedMovie.length === 0) {
          movedMovie = remove(savedMovies, movie => movieId === movie.id);
        }
        // add the movie to our local dismissed movies list
        const updatedDismissedMovies = unionBy(dismissedMovies, movedMovie, 'id');

        dispatch(dismissedMovie(moviesQueue, savedMovies, updatedDismissedMovies));
      })
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}

export function undismissMovie(movieId) {
  return (dispatch, getState) => {
    dispatch(undismissingMovie());

    const uri = `/api/secure/movies/${movieId}`;
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'PATCH',
      body: JSON.stringify({
        dismissed: false,
      }),
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(() => {
        const moviesState = getState().moviesState;
        const { moviesQueue, savedMovies, dismissedMovies } = moviesState;

        // remove the movie from our dismissed movies locally
        const movedMovie = remove(dismissedMovies, movie => movieId === movie.id);
        // add the movie to the correct local queue
        let updatedMoviesQueue = moviesQueue;
        let updatedSavedMovies = savedMovies;
        if (movedMovie[0].saved) {
          updatedSavedMovies = unionBy(savedMovies, movedMovie, 'id');
        } else {
          updatedMoviesQueue = unionBy(moviesQueue, movedMovie, 'id');
        }

        dispatch(undismissedMovie(updatedMoviesQueue, updatedSavedMovies, dismissedMovies));
      })
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}
