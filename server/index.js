// initialize the configuration first!
require('./config/init')();

import config from './config';
import app from './express';

const logger = require('./logger')();

logger.log('config: %j', config);

app.listen(config.port, function onStart(err) {
  if (err) {
    logger.log(err);
  }

  /* eslint max-len:0 */
  logger.log(`Express server listening on port ${config.port} in ${process.env.NODE_ENV} environment`);
});
