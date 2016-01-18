import path from 'path';
import express from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const APP_ROOT = path.join(__dirname, '../');

const app = express();

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

// for now, all requests render the index page
app.all('*', function response(req, res) {
  res.sendFile(path.join(APP_ROOT, 'public', 'index.html'));
});

export default app;
