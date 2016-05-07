import { createAction } from 'redux-actions';
import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../utils/http.utils';

import {
  LOADING_MOVIES,
  MOVIES_LOADED,
  FAILED_LOADING_MOVIES,
} from '../constants/movie.action-types';

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
  return (dispatch, getState) => {
    dispatch(moviesLoading());

    const moviesState = getState().moviesState;
    const movies = moviesState.movies;
    const skip = moviesState.skip;
    const limit = moviesState.limit;

    const uri = `/api/secure/movies?skip=${skip}&limit=${limit}`;
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'GET',
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(response => response.json())
      .then(newMovies => {
        const updatedMovies = movies.concat(newMovies);
        return dispatch(moviesLoaded(updatedMovies));
      })
      .catch((error) => handleHttpError(dispatch, error, failedLoadingMovies));
  };
}
