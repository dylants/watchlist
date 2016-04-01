import path from 'path';
import express from 'express';
import glob from 'glob';

const API_ROOT = path.join(__dirname, 'api');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const APP_ROOT = path.join(__dirname, '../');

const app = express();

/* **************
 * *** ROUTES ***
 * **************/
const ROUTE_PATH = path.join(API_ROOT, 'routes');
const router = new express.Router();
glob(`${ROUTE_PATH}/**/*.js`, (err, files) => {
  files.map(file => require(file)(router));
});
app.use(router);

// in non-production environments, configure webpack dev middleware with hot reloading
if (!IS_PRODUCTION) {
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
 */
app.all('*', (req, res) => {
  res.sendFile(path.join(APP_ROOT, 'public', 'index.html'));
});

export default app;
