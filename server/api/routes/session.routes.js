import { login, logout } from '../controllers/session.controller';

module.exports = (router) => {
  router.route('/api/session').post(login);
  router.route('/api/session').delete(logout);
};
