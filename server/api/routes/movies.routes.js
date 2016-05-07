import { getMovies, pullMovieData } from '../controllers/movies.controller';

module.exports = (router) => {
  router.route('/api/secure/movies').get(getMovies);
  router.route('/api/secure/download-movie-data').get(pullMovieData);
};