import { remove, unionBy } from 'lodash';

import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  SAVING_MOVIE,
  SAVED_MOVIE,
  DISMISSING_MOVIE,
  DISMISSED_MOVIE,
  UNDISMISSED_MOVIE,
  UNDISMISSING_MOVIE,
  FAILED_UPDATING_MOVIE,
} from '../action-types/movie.action-types';

function savingMovie() {
  return { type: SAVING_MOVIE };
}

function savedMovie(moviesQueue, savedMovies) {
  return {
    type: SAVED_MOVIE,
    moviesQueue,
    savedMovies,
  };
}

function dismissingMovie() {
  return { type: DISMISSING_MOVIE };
}

function dismissedMovie(moviesQueue, savedMovies, dismissedMovies) {
  return {
    type: DISMISSED_MOVIE,
    moviesQueue,
    savedMovies,
    dismissedMovies,
  };
}

function undismissingMovie() {
  return { type: UNDISMISSING_MOVIE };
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
