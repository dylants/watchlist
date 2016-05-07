import util from 'util';

const logger = require('../../lib/logger')();

import {
  loadMovies,
  downloadMovieData,
  dismissMovie,
} from '../../lib/movies';

function handleError(err, res) {
  return res.status(500).send({
    error: typeof err === 'object' ? util.inspect(err) : err,
  });
}

export function getMovies(req, res) {
  const skip = req.query.skip;
  const limit = req.query.limit;

  loadMovies({}, {
    skip,
    limit,
  }, (err, movies) => {
    if (err) { return handleError(err, res); }

    return res.send(movies);
  });
}

export function pullMovieData(req, res) {
  downloadMovieData((err, stats) => {
    if (err) { return handleError(err, res); }

    return res.send(stats);
  });
}

export function updateMovie(req, res) {
  const movieId = req.params.movieId;
  const body = req.body;

  logger.log('updateMovie: body: ', body);

  // we allow dismissing a movie only
  if (body.dismissed) {
    return dismissMovie(movieId, (err, movie) => {
      if (err) { return handleError(err, res); }

      return res.send(movie);
    });
  } else {
    return res.status(400).end();
  }
}
