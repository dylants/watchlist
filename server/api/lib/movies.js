import request from 'request';

import config from '../../config';

export function loadMovieData(callback) {
  // the domain and API are read from the config (so they can be overridden)
  const DOMAIN = config.movies.domain;
  const API = config.movies.api;

  // the amount of movies we should pull in
  const LIMIT = 50;

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
    return callback(error, body ? body.results : null);
  });
}

export function parseMovies(movies) {
  // convert each movie contained within our list to our schema
  return movies.map(movie => {
    const { title, mpaaRating, runtime, synopsis } = movie;
    return {
      title,
      userScore: movie.popcornScore,
      criticScore: movie.tomatoScore,
      mpaaRating,
      runtime,
      synopsis,
    };
  });
}
