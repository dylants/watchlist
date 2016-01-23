import async from 'async';
import util from 'util';

import {
  loadMovies,
  downloadMovieData,
  parseMovies,
  filterMovies,
  saveMovies,
} from '../../lib/movies';

function handleError(err, res) {
  return res.status(500).send({
    error: typeof err === 'object' ? util.inspect(err) : err,
  });
}

export function getMovies(req, res) {
  loadMovies((err, movies) => {
    if (err) {
      return handleError(err, res);
    }

    return res.send(movies);
  });
}

export function pullMovieData(req, res) {
  async.waterfall([

    // load the raw movie data
    downloadMovieData,

    // parse the raw movie data into a form we understand
    parseMovies,

    // filter the movies to only save those we want to look at later
    filterMovies,

    // save the movies to our database
    saveMovies,
  ], (err, movies) => {
    if (err) {
      return handleError(err, res);
    }

    // instead of sending them the movies, send them information on the download
    return res.send({
      success: true,
      moviesLoaded: movies.length,
    });
  });
}
