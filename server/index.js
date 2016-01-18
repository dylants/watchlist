/* eslint no-console:0 */

// initialize the application
import init from './config/init';
init();

import config from './config';
import app from './express';

console.log('config: %j', config);

app.listen(config.port, function onStart(err) {
  if (err) {
    console.log(err);
  }

  /* eslint max-len:0 */
  console.log(`Express server listening on port ${config.port} in ${process.env.NODE_ENV} environment`);
});
