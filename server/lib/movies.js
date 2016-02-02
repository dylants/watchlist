import request from 'request';
import async from 'async';
import mongoose from 'mongoose';
import _ from 'lodash';
import config from '../config';

const Movie = mongoose.model('Movie');
const logger = require('./logger')();

/**
 * Requests movie metadata from the remote service
 */
function retrieveMovieData(callback) {
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
    if (error) { return callback(error); }

    const results = body.results;
    logger.log(`loadMovieData: returning ${results.length} movies`);

    return callback(null, results);
  });
}

/**
 * Converts the raw movie data into our internal representation
 */
function parseMovies(movies, callback) {
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
 * Filters the movies list based on our criteria, which can be configured
 */
function filterMovies(movies, callback) {
  logger.log(`filterMovies: incoming movies: ${movies.length}`);

  // pull values from the config
  const topMoviesIndex = config.movieFilter.topMoviesIndex;
  const minUserScore = config.movieFilter.minUserScore;
  const minCriticScore = config.movieFilter.minCriticScore;
  const minUserCriticScore = config.movieFilter.minUserCriticScore;

  // filter the movies...
  const filteredMovies = _(movies)
    .filter((movie, index) => {
      // take the first set of movies configured (no matter what)
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
 * Saves a single movie to the database, updating it if it already exists.
 * This function calls the callback with two parameters:
 *   - optional error object
 *   - an object which contains:
 *     - movie: the movie object after the save operation
 *     - isNew: boolean indicating if the movie did not exist and was created
 *      (if this is false, the movie was found and instead updated)
 */
function saveMovie(movie, callback) {
  logger.log(`saveMovie: movie title: ${movie.title}`);

  // because we _may_ be doing an update, we must remove undefined values
  // to avoid problems with mongoose/mongo $set's
  const movieMetadata = _(movie)
    .omitBy(_.isUndefined)
    .omitBy(_.isNull)
    .value();

  // determine the ID of the movie
  const id = Movie.generateId(movieMetadata);
  logger.log(`saveMovie: attempting to find and update ${id}`);

  return Movie.findById(id, (err, doc) => {
    if (err) { return callback(err); }

    if (doc) {
      // the movie exists, update it
      return Movie.findByIdAndUpdate(id, movieMetadata, { new: true },
        (updateErr, updatedMovie) => {
          if (updateErr) { return callback(updateErr); }

          // call the callback with the updated movie and not isNew
          return callback(null, {
            movie: updatedMovie,
            isNew: false,
          });
        }
      );
    } else {
      // the movie does NOT exist, create it
      const newMovie = new Movie(movieMetadata);
      return newMovie.save((saveErr, savedMovie) => {
        if (saveErr) { return callback(saveErr); }

        // call the callback with the saved movie and isNew
        return callback(null, {
          movie: savedMovie,
          isNew: true,
        });
      });
    }
  });
}

/**
 * Saves all movies to the database.
 * This function calls the callback with two parameters:
 *   - optional error object
 *   - an object which contains:
 *     - totalMovies: number of total movies processed
 *     - moviesAdded: number of movies added (as new movie metadata)
 *     - moviesUpdated: number of movies updated (existing movie metadata)
 */
function saveMovies(movies, callback) {
  // collect statistics on the processed movie data
  const stats = {
    totalMovies: 0,
    moviesAdded: 0,
    moviesUpdated: 0,
  };

  // process each movie within the array of movies
  return async.each(movies, (movie, eachCallback) => {
    // for each movie, save the movie metadata
    return saveMovie(movie, (err, data) => {
      if (err) { return eachCallback(err); }

      // update the stats
      stats.totalMovies++;
      if (data.isNew) {
        stats.moviesAdded++;
      } else {
        stats.moviesUpdated++;
      }

      // next!
      return eachCallback();
    });
  }, (err) => {
    return callback(err, stats);
  });
}

/**
 * Takes a Movie model and translates it to our UI version of a "movie",
 * returning this movie UI object.
 */
function buildMovieUI(movie) {
  // pull common values from the movie
  const {
    title,
    userScore,
    criticScore,
    mpaaRating,
    runtime,
    synopsis,
    images,
    saved,
    dismissed,
  } = movie;

  // take the first image as the main display image (if available)
  const image = images && (images.length > 0) && images[0];

  return {
    id: movie._id,
    title,
    userScore,
    criticScore,
    mpaaRating,
    runtime,
    synopsis,

    // let's be more declaritive for these "optional" values
    image: image ? image : null,
    saved: saved ? saved : false,
    dismissed: dismissed ? dismissed : false,
  };
}

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// -------------------------- EXPORTED FUNCTIONS ---------------------------
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------

/**
 * This function pulls the whole process together of retrieving the movie
 * metadata, parsing it into a format that we understand, filtering it based
 * on our criteria, and finally, saving it to our database.
 * The callback is called with two parameters:
 *   - an optional error object
 *   - an object which contains statistics on the overall job operation
 */
export function downloadMovieData(callback) {
  async.waterfall([

    // load the raw movie data
    retrieveMovieData,

    // parse the raw movie data into a form we understand
    parseMovies,

    // filter the movies to only save those we want to look at later
    filterMovies,

    // save the movies to our database
    saveMovies,
  ], callback);
}

/**
 * Returns the movies from our internal database, modified to fit the UI
 */
export function loadMovies(callback) {
  // find all the movies in our database
  return Movie.find((findErr, movies) => {
    if (findErr) { return callback(findErr); }

    // build the movies UI list by parsing each movie
    const moviesUI = movies.map(movie => buildMovieUI(movie));

    return callback(null, moviesUI);
  });
}
