import util from 'util';

import { loadMovies, downloadMovieData } from '../../lib/movies';

function handleError(err, res) {
  return res.status(500).send({
    error: typeof err === 'object' ? util.inspect(err) : err,
  });
}

export function getMovies(req, res) {
  const skip = req.query.skip;
  const limit = req.query.limit;

  loadMovies({
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