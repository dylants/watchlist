import request from 'request';
import async from 'async';
import mongoose from 'mongoose';
import _ from 'lodash';
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
  // pull values from the config
  const domain = config.movies.domain;
  const api = config.movies.api;
  const limit = config.movies.limit;
  const type = config.movies.type;
  const sortBy = config.movies.sortBy;

  const url = domain + api + `?limit=${limit}&type=${type}&sortBy=${sortBy}`;

  // request the movie data, and return the results if found
  request({
    url,
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

export function filterMovies(movies, callback) {
  logger.log(`filterMovies: incoming movies: ${movies.length}`);

  // pull values from the config
  const topMoviesIndex = config.movieFilter.topMoviesIndex;
  const minUserScore = config.movieFilter.minUserScore;
  const minCriticScore = config.movieFilter.minCriticScore;
  const minUserCriticScore = config.movieFilter.minUserCriticScore;

  // filter the movies...
  const filteredMovies = _(movies)
    .filter((movie, index) => {
      // take the first 10 movies (no matter what)
      if (index < topMoviesIndex) {
        logger.log(`filterMovies: keeping ${movie.title} because of index`);
        return true;
      }

      // if a movie has a user score above the required amount, include it
      if (movie.userScore >= minUserScore) {
        logger.log(`filterMovies: keeping ${movie.title} because of user score`);
        return true;
      }

      // if a movie has a critic score above the required amount, include it
      if (movie.criticScore >= minCriticScore) {
        logger.log(`filterMovies: keeping ${movie.title} because of critic score`);
        return true;
      }

      // if a movie has both a user and critic score above required amount, include it
      if ((movie.userScore >= minUserCriticScore) &&
        (movie.criticScore >= minUserCriticScore)) {
        logger.log(`filterMovies: keeping ${movie.title} because of user and critic score`);
        return true;
      }
    })
    .value();

  logger.log(`filterMovies: after filtering, returning ${filteredMovies.length} movies`);

  return callback(null, filteredMovies);
}

/**
 * Saves a single movie to the database, updating it if it already exists
 */
function saveMovie(movie, callback) {
  logger.log(`saveMovie: movie title: ${movie.title}`);

  // because we're doing an update, we must remove undefined values to avoid
  // problems with mongoose/mongo $set's
  const movieMetadata = _(movie)
    .omitBy(_.isUndefined)
    .omitBy(_.isNull)
    .value();

  // attempt to update the movie if possible
  const id = slugify(movieMetadata.title);
  logger.log(`saveMovie: attempting to find and update ${id}`);
  return Movie.findByIdAndUpdate(id, movieMetadata, { upsert: true, new: true },
    callback);
}

/**
 * Saves all movies to the database
 */
export function saveMovies(movies, callback) {
  return async.map(movies, saveMovie, callback);
}
