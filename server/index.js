// initialize the configuration first!
require('./config/init')();

const logger = require('./lib/logger')();

// load and output the configuration
import config from './config';
logger.log('config: %j', config);

// load the mongo database
import './mongo';

// load the express application
import app from './express';

// load the passport configuration
import './passport';

// start the application
app.listen(config.port, (err) => {
  if (err) {
    logger.log(err);
  }

  logger.log(`Express server listening on port ${config.port} ` +
    `in ${process.env.NODE_ENV} environment`);
});
