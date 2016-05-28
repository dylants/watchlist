# watchlist #

[![Build Status][travis-image]][travis-url]

What to watch.

## Run the Application ##

To run the application, some initial setup is required:

### Install Node ###

Since this is a [Node.js](http://nodejs.org/) project, please make sure
Node is installed on the machine. A recommended install method is to use
[nvm](https://github.com/creationix/nvm) which installs Node into your
home directory.

### Install Dependencies ###

Once Node is installed, from this project's root directory run the following
command to install the project dependencies:

`$ npm install`

### Start the App ###

This project is configured to load separate configuration based on the
environment where it is run (for example, `development` vs `production`).
The environment is specified via the `NODE_ENV` environment variable.
If no environment is specified, it will default to `development`.

To start the application (in development mode), execute the following command:

`$ npm start`

This script will call `babel-node` to run the server side code in an "esnext"
environment. This compiles all the server side source code into ES5 to run
via `node` (it caches the compiled code to memory). This also runs `webpack`
in a "development" manner that similarly loads all the packs to memory and serves
them up when requested. This is to allow dynamic updates while developing.

(It is [not advised](https://babeljs.io/docs/usage/cli/#babel-node)
to run `babel-node` in `production` environment, so an alternate path is taken
for `npm run production`. Please see below for more details.)

The current available environments include:

*   `development`
*   `production`

#### Production ####

In production mode the application is setup to use minified assets.
The `build` task produces both compiled server side assets and minified
webpack client side assets. To execute this task, run the following command:

`$ npm run build`

The `production-build` task performs the same actions as the `build` task,
but removes any development dependencies and only retains those files necessary
to run the server in a production environment. This was done to limit the size
of the deliverable.

`$ npm run production-build`

(Note that both the `build` or `production-build` tasks produce the same build
assets -- it is only required to run one command.)

Once the build assets are generated, to start the server in the `production`
environment, execute the following command:

`$ npm run production`

This command does not watch for file changes and only serves up what was produced
during the `production-build` script execution. This was done to allow a separate
"production" process to monitor the state of the server, and not restart
automatically if changes are made to the file system.

### Configuration ###

Most all of the app's configuration is held within the `server/config/index.js`
file. Some of these values can be specified via environment variables. Below is
a list of those variables:

* Node Server
    * `PORT` : The port for the node application server, defaults to `3000` in
    all environments.
* Mongo
    * `MONGO_PROTOCOL` : The protocol for the mongodb connection, defaults to
    `mongodb://`
    * `MONGO_HOST` : Hostname for mongodb, defaults to `localhost`
    * `MONGO_PORT` : Port for mongodb, defaults to `27017`
    * `MONGO_DB` : Database for mongodb, defaults to `watchlist`
* Movies API
    * `MOVIES_DOMAIN` : The domain used to retrieve movie data.
    * `MOVIES_API` : The API (URL) used to retrieve movie data.
    * `MOVIES_LIMIT` : Limit on the amount of movies retrieved, defaults to `100`.
    * `MOVIES_TYPE` : Type of movies to retrieve, possible values include
    `in-theaters` and `opening`, defaults to `in-theaters`.
    * `MOVIES_SORT_BY` : How to sort the movies retrieved, possible values
    include `popularity` and `release`, defaults to `popularity`.
    * `MOVIES_REQUEST_ENCODING` : Encoding of the HTTP request, defaults to
    `binary`. See
    [the request options documentation](https://github.com/request/request#requestoptions-callback)
    for more details.
* Movie Filter - Attributes here define how the movies are filtered after they
are retrieved from the movies API. These rules are listed in order of evaluation
within the filter, so if a movie does not match the first rule, it can still
be included by matching the next rule, and so on.
    * `TOP_MOVIES_INDEX` : Number of movies to include from the start of the
    list (so with a value of 10, the first 10 movies would be included in the
    filter). Defaults to `0`.
    * `MIN_USER_SCORE` : Minimum user score to include in the filter if the
    movie has not yet been included, defaults to `70`.
    * `MIN_CRITIC_SCORE` : Minimum critic score to include in the filter if
    the movie has not yet been included, defaults to `80`.
    * `MIN_USER_CRITIC_SCORE` : Minimum user AND critic score to include in
    the filter if the movie has not yet been included, defaults to `60`.
* Movie Trailer API
    * `MOVIE_TRAILER_DOMAIN` : The domain used to retrieve movie trailer data.
    * `MOVIE_TRAILER_API` : The API (URL) used to retrieve movie trailer data.
    * `MOVIE_TRAILER_API_MOVIE_ID_PLACEHOLDER` : The string placeholder within
    the movie trailer API which should be replaced with the movie ID. Defaults
    to `MOVIE_ID`.
    * `MOVIE_TRAILER_LIMIT` : Limit the amount of trailers retrieved, defaults
    to `1`.
* Movie Cleanup
    * `MOVIE_CLEANUP_MODIFIED_DAYS_AGO` : Dismissed movies that have NOT been
    modified as recently as this many days ago will be deleted. For example,
    the default value is `5`, meaning dismissed movies that have not been
    updated in 5 days (either by a movie update or a user action) will be
    removed at next scheduled cleanup.

## Tests ##

There are tests for the client and server side code, which use
[Mocha](https://mochajs.org/) as the test framework. Running the `test`
script will lint the files and run the tests. This can be done by
executing the following command:

`$ npm test`

To only run the mocha tests, execute:

`$ npm run test:mocha`

To run the mocha tests in a "watch" mode:

`$ npm run test:watch`

## Test App ##

A test application is available to test out components used within the main
application. To run the test app, execute the following command:

`$ npm run test-app`

The contents of the test application are not included in the webpack bundle
used in the main application. The `TEST_APP` environment variable is used
to determine which application `index.js` file to use, which imports in the
necessary files.

[travis-image]: https://img.shields.io/travis/dylants/watchlist/master.svg
[travis-url]: https://travis-ci.org/dylants/watchlist
