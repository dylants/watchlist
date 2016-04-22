import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'cookie-session';
import passport from 'passport';
import glob from 'glob';
import history from 'connect-history-api-fallback';

const API_ROOT = path.join(__dirname, 'api');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const APP_ROOT = path.join(__dirname, '../');

// 30 days for session cookie lifetime
const SESSION_COOKIE_LIFETIME = 1000 * 60 * 60 * 24 * 30;

// Verifies the user is authenticated, else returns unauthorized
function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({
    error: 'Unauthorized',
  });
}

// Create the express application
const app = express();

// use express' body parser to access body elements later
app.use(bodyParser.json());

// use express' session
app.use(session({
  name: 'watchlist',
  secret: 'super-secret-watchlist',
  cookie: {
    maxAge: SESSION_COOKIE_LIFETIME,
  },
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// all routes under /api/secure require authentication
app.all('/api/secure/*', requireAuthentication);

// load the server controllers (via the routes)
const ROUTE_PATH = path.join(API_ROOT, 'routes');
const router = new express.Router();
glob(`${ROUTE_PATH}/**/*.js`, (err, files) => {
  files.map(file => require(file)(router));
});
app.use(router);

// in non-production environments, configure webpack dev middleware with hot reloading
if (!IS_PRODUCTION) {
  // use the history middleware to rewrite requests to our SPA
  // (only necessary in non-production mode b/c of webpack dev middleware)
  app.use(history({
    // to help in development, allow API requests to pass through
    rewrites: [
      {
        from: /^\/api\/.*$/,
        to: (context) => context.parsedUrl.pathname,
      },
    ],
  }));

  // only load these dependencies if we are not in production to avoid
  // requiring them in production mode (when they are only required in dev)
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.js');

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(path.join(APP_ROOT, 'public')));
}

// if at this point we don't have a route match for /api, return 404
app.all('/api/*', (req, res) => {
  res.status(404).send({
    error: `route not found: ${req.url}`,
  });
});

/*
 * THIS MUST BE THE LAST ROUTE
 * configure all remaining routes to hit the UI
 * This was done so that the root URL hits the UI app, and that UI app
 * handles all URLs under that. Know that at this point we have "reserved"
 * /api/*, for APIs. If that URL is used by the UI, it won't resolve correctly.
 *
 * Note that based on what we've done above, this will only take effect in
 * the production environment.
 */
app.all('*', (req, res) => {
  res.sendFile(path.join(APP_ROOT, 'public', 'index.html'));
});

export default app;
