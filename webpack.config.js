// We need to 'use strict' here because this file isn't compiled with babel
/* eslint strict:0 */
'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const git = require('git-rev-sync');
const path = require('path');

// default the environment to development
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const appPath = path.join(__dirname, 'app');
const assetsPath = path.join(__dirname, 'public');
const publicPath = '/';
const GIT_REVISION = git.long();

function getPlugins() {
  // These plugins are used in all environments
  const plugins = [

    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),

    // http://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
    new webpack.optimize.OccurenceOrderPlugin(),

    // http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ];

  // add plugins that should be used only in certain environments
  if (IS_PRODUCTION) {
    // http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    plugins.push(new webpack.optimize.DedupePlugin());

    // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
    }));

    // https://webpack.github.io/docs/stylesheets.html
    // https://github.com/webpack/extract-text-webpack-plugin
    plugins.push(new ExtractTextPlugin(`[name]-${GIT_REVISION}.min.css`));
  } else {
    // http://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
}

function getLoaders() {
  // https://github.com/webpack/style-loader
  const styleLoaderConfig = 'style';
  // https://github.com/webpack/css-loader
  const cssLoaderConfig = 'css' +
    '?modules' +
    '&sourceMap' +
    '&localIdentName=[local]___[hash:base64:5]';
  // https://github.com/jtangelder/sass-loader
  const sassLoaderConfig = 'sass' +
    '?outputStyle=expanded' +
    '&sourceMap';

  let cssLoaders;
  if (IS_PRODUCTION) {
    // https://github.com/webpack/extract-text-webpack-plugin
    cssLoaders = ExtractTextPlugin.extract(
      `${cssLoaderConfig}!${sassLoaderConfig}`
    );
  } else {
    cssLoaders = `${styleLoaderConfig}!${cssLoaderConfig}!${sassLoaderConfig}`;
  }

  const loaders = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0', 'react'],
      },
    }, {
      test: /(\.scss)$/,
      exclude: /node_modules/,
      loader: cssLoaders,
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    },
  ];

  return loaders;
}

function getEntry() {
  const entry = [];

  // https://github.com/github/fetch
  // fetch polyfill to support older browsers
  entry.push('whatwg-fetch');

  // hot reload only when in non-production environment
  if (!IS_PRODUCTION) {
    // https://github.com/glenjamin/webpack-hot-middleware#config
    entry.push('webpack-hot-middleware/client?reload=true');
  }

  // add our entry point for the client web app
  // if TEST_APP then we build the test application, else the main one
  if (process.env.TEST_APP) {
    entry.push(path.join(appPath, 'test-app-index.js'));
  } else {
    entry.push(path.join(appPath, 'index.js'));
  }

  return entry;
}

function getOutput() {
  let output;

  // in production, we need a special output object
  if (IS_PRODUCTION) {
    output = {
      path: assetsPath,
      publicPath,
      filename: `[name]-${GIT_REVISION}.min.js`,
    };
  } else {
    output = {
      path: assetsPath,
      publicPath,
      filename: '[name].js',
    };
  }

  return output;
}

module.exports = {
  // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  target: NODE_ENV === 'test' ? 'node' : 'web',

  // enable debug and cache in non-production environments
  debug: !IS_PRODUCTION,
  cache: !IS_PRODUCTION,

  // more info: https://webpack.github.io/docs/build-performance.html#sourcemaps
  // more info: https://webpack.github.io/docs/configuration.html#devtool
  devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-source-map',

  // set to false to see a list of every file being bundled.
  noInfo: true,

  eslint: {
    configFile: './.eslintrc',
  },

  resolve: {
    // defines where the code resides
    root: appPath,

    // lists file types that can have optional extensions
    extensions: ['', '.js', '.jsx'],

    // sets a base dir for imports
    modulesDirectories: ['node_modules', 'app'],
  },

  plugins: getPlugins(),

  module: {
    loaders: getLoaders(),
  },

  entry: getEntry(),

  output: getOutput(),

};
