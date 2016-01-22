// initialize the configuration first!
require('./config/init')();

const logger = require('./logger')();

// load and output the configuration
import config from './config';
logger.log('config: %j', config);

// load the mongo database
import './mongo';

// load the express application
import app from './express';

// start the application
app.listen(config.port, function onStart(err) {
  if (err) {
    logger.log(err);
  }

  /* eslint max-len:0 */
  logger.log(`Express server listening on port ${config.port} in ${process.env.NODE_ENV} environment`);
});
