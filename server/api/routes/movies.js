import { getMovies, pullMovieData } from '../controllers/movies';

module.exports = (router) => {
  router.route('/api/movies').get(getMovies);
  router.route('/api/download-movie-data').get(pullMovieData);
};
