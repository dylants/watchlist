import passport from 'passport';

const logger = require('../../lib/logger')();

export function login(req, res, next) {
  // calls passport's local strategy to authenticate
  return passport.authenticate('local', (err, user, info) => {
    // if any problems exist, error out
    if (err) {
      logger.error('login: Error during local authentication!', err);
      return next(err);
    }

    // authentication failed
    if (!user) {
      logger.log('login: no user -- authentication failed, returning 401');
      return res.status(401).send({
        error: info.message,
      });
    }

    // log in the user
    return req.logIn(user, (loginError) => {
      if (loginError) {
        logger.error('login: error during logIn!', loginError);
        return next(loginError);
      }

      // once login succeeded, return the user and session created 201
      logger.log('login: login successful, returning 201 with user');
      return res.status(201).send(user);
    });
  })(req, res, next);
}

export function logout(req, res) {
  req.logout();
  logger.log('logout: logout successful, returning 204');
  return res.status(204).end();
}
