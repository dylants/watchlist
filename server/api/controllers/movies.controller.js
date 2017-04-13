import {
  loadMovies,
  downloadMovieData,
  enableSaved,
  enableDismissed,
  disableDismissed,
  populateMovieTrailer,
  removeStaleMovies,
} from '../../lib/movies';
import {
  convertQueryStringToNumber,
  handleError,
} from '../../lib/http';

const logger = require('../../lib/logger')();

export function getMovies(req, res) {
  const { saved, dismissed, skip, limit } = req.query;

  // to allow a user to query for dismissed in both saved and not saved,
  // only apply the saved filter if the user requests it specifically
  const conditions = { dismissed };
  if (saved) {
    if (saved === 'false') {
      conditions.saved = false;
    } else {
      conditions.saved = true;
    }
  }

  // skip and limit must both be numbers
  const parsedSkip = convertQueryStringToNumber(skip);
  const parsedLimit = convertQueryStringToNumber(limit);

  loadMovies(conditions, { skip: parsedSkip, limit: parsedLimit }, (err, movies) => {
    if (err) { return handleError(err, 'getMovies', res); }

    return res.send(movies);
  });
}

export function updateMovie(req, res) {
  const movieId = req.params.movieId;
  const body = req.body;

  logger.log('updateMovie: body: ', body);

  function handleCallback(err, movie) {
    if (err) { return handleError(err, 'updateMovie', res); }

    return res.send(movie);
  }

  // we allow saved, dismissed, and undo dismissed
  if (body.hasOwnProperty('dismissed')) {
    if (body.dismissed) {
      return enableDismissed(movieId, handleCallback);
    } else {
      return disableDismissed(movieId, handleCallback);
    }
  } else if (body.saved) {
    return enableSaved(movieId, handleCallback);
  } else {
    return res.status(400).end();
  }
}

export function addMovieTrailer(req, res) {
  const movieId = req.params.movieId;

  return populateMovieTrailer(movieId, (err, movie) => {
    if (err) { return handleError(err, 'addMovieTrailer', res); }

    return res.send(movie);
  });
}

export function pullMovieData(req, res) {
  return downloadMovieData((err, stats) => {
    if (err) { return handleError(err, 'pullMovieData', res); }

    return res.send(stats);
  });
}

export function deleteStaleMovies(req, res) {
  return removeStaleMovies((err, stats) => {
    if (err) { return handleError(err, 'deleteStaleMovies', res); }

    return res.send(stats);
  });
}
