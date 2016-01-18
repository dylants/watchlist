import { loadMovies } from '../controllers/movies';

module.exports = (router) => {
  router.route('/api/movies').get(loadMovies);
};
