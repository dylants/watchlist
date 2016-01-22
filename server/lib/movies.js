import request from 'request';
import async from 'async';
import mongoose from 'mongoose';
import config from '../config';
import slugify from './slugify';

const Movie = mongoose.model('Movie');
const logger = require('./logger')();

/**
 * Returns the movies in our internal database
 */
export function loadMovies(callback) {
  return Movie.find(callback);
}

/**
 * Downloads movie metadata from the remote service
 */
export function downloadMovieData(callback) {
  // the domain and API are read from the config (so they can be overridden)
  const DOMAIN = config.movies.domain;
  const API = config.movies.api;

  // the amount of movies we should pull in
  const LIMIT = 10;

  // available types include 'in-theaters' and 'opening'
  const TYPE = 'in-theaters';

  // not really sure here on the values for sortBy
  const SORT_BY = 'popularity';

  const URL = DOMAIN + API + `?limit=${LIMIT}&type=${TYPE}&sortBy=${SORT_BY}`;

  // request the movie data, and return the results if found
  request({
    url: URL,
    method: 'GET',
    json: true,
  }, (error, response, body) => {
    if (error) {
      return callback(error);
    }

    const results = body.results;
    logger.log(`loadMovieData: returning ${results.length} movies`);

    return callback(null, results);
  });
}

/**
 * Converts the raw movie data into our internal representation
 */
export function parseMovies(movies, callback) {
  // convert each movie contained within our list to our schema
  return callback(null, movies.map(movie => {
    const { title, mpaaRating, runtime, theaterReleaseDate, synopsis } = movie;

    // pull in the images if they exist
    const images = [];
    if (movie.posters) {
      if (movie.posters.primary) {
        images.push(movie.posters.primary);
      }

      if (movie.posters.secondary) {
        images.push(movie.posters.secondary);
      }
    }

    return {
      title,
      userScore: movie.popcornScore,
      criticScore: movie.tomatoScore,
      mpaaRating,
      runtime,
      theaterReleaseDate,
      synopsis,
      images,
    };
  }));
}

/**
 * Saves a single movie to the database, updating it if it already exists
 */
function saveMovie(movie, callback) {
  logger.log(`saveMovie: movie title: ${movie.title}`);

  // attempt to update the movie if possible
  const id = slugify(movie.title);
  logger.log(`saveMovie: attempting to find and update ${id}`);
  return Movie.findByIdAndUpdate(id, movie, { upsert: true, new: true }, callback);
}

/**
 * Saves all movies to the database
 */
export function saveMovies(movies, callback) {
  return async.map(movies, saveMovie, callback);
}
