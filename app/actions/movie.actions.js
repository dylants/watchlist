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

function savedMovie(updatedMovie) {
  return {
    type: SAVED_MOVIE,
    updatedMovie,
  };
}

function dismissingMovie() {
  return { type: DISMISSING_MOVIE };
}

function dismissedMovie(updatedMovie) {
  return {
    type: DISMISSED_MOVIE,
    updatedMovie,
  };
}

function undismissingMovie() {
  return { type: UNDISMISSING_MOVIE };
}

function undismissedMovie(updatedMovie) {
  return {
    type: UNDISMISSED_MOVIE,
    updatedMovie,
  };
}

function failedUpdatingMovie(error) {
  return {
    type: FAILED_UPDATING_MOVIE,
    error,
  };
}

export function saveMovie(movieId) {
  return (dispatch) => {
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
      .then(response => response.json())
      .then(updatedMovie => dispatch(savedMovie(updatedMovie)))
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}

export function dismissMovie(movieId) {
  return (dispatch) => {
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
      .then(response => response.json())
      .then(updatedMovie => dispatch(dismissedMovie(updatedMovie)))
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}

export function undismissMovie(movieId) {
  return (dispatch) => {
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
      .then(response => response.json())
      .then(updatedMovie => dispatch(undismissedMovie(updatedMovie)))
      .catch((error) => handleHttpError(dispatch, error, failedUpdatingMovie));
  };
}
