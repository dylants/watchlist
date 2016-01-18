import async from 'async';
import util from 'util';

import { loadMovieData, parseMovies } from '../lib/movies';

function handleError(err, res) {
  return res.status(500).send({
    error: typeof err === 'object' ? util.inspect(err) : err,
  });
}

export function loadMovies(req, res) {
  async.waterfall([

    // load the raw movie data
    loadMovieData,
  ], (err, movies) => {
    if (err) {
      return handleError(err, res);
    }

    // convert the raw movie data into a format we can use
    const parsedMovies = parseMovies(movies);

    return res.send(parsedMovies);
  });
}
