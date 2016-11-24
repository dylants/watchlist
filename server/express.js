import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'cookie-session';
import passport from 'passport';
import glob from 'glob';
import history from 'connect-history-api-fallback';
import config from './config';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Create the express application
const app = express();

// use express' body parser to access body elements later
app.use(bodyParser.json());

/* ------------------------------------------ *
 * Security / Passport configuration
 * ------------------------------------------ */

// 365 days for session cookie lifetime
const SESSION_COOKIE_LIFETIME = 1000 * 60 * 60 * 24 * 365;

// use express' session
app.use(session({
  name: config.session.name,
  secret: config.session.secret,
  maxAge: SESSION_COOKIE_LIFETIME,
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

/* ------------------------------------------ *
 * API configuration
 * ------------------------------------------ */
const API_ROOT = path.join(__dirname, 'api');
const ROUTE_PATH = path.join(API_ROOT, 'routes');

// all routes under /api/secure require authentication
app.all('/api/secure/*', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({
    error: 'Unauthorized',
  });
});

// load the server controllers (via the routes)
const router = new express.Router();
glob(`${ROUTE_PATH}/**/*.js`, (err, files) => {
  files.map(file => require(file)(router));
});
app.use(router);

// if at this point we don't have a route match for /api, return 404
app.all('/api/*', (req, res) => {
  res.status(404).send({
    error: `route not found: ${req.url}`,
  });
});

/* ------------------------------------------ *
 * UI (render the app)
 * ------------------------------------------ */

// in development environment, configure webpack dev middleware with hot reloading
if (IS_DEVELOPMENT) {
  // use the history middleware to rewrite requests to our SPA
  // (only necessary in development mode b/c of webpack dev middleware)
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
}

if (IS_PRODUCTION) {
  const APP_ROOT = path.join(__dirname, '../');

  // serve the static assets (JS/CSS)
  app.use(express.static(path.join(APP_ROOT, 'public')));

  /*
   * THIS MUST BE THE LAST ROUTE
   * configure all remaining routes to hit the UI
   * This was done so that the root URL hits the UI app, and that UI app
   * handles all URLs under that. Know that at this point we have "reserved"
   * /api/*, for APIs. If that URL is used by the UI, it won't resolve correctly.
   */
  app.all('*', (req, res) => {
    res.sendFile(path.join(APP_ROOT, 'public', 'index.html'));
  });
}

export default app;
