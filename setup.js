// ******************* //
// BEGIN CONFIGURATION //
// ******************* //

const USERNAME = 'my_username';
const PASSWORD = 'my_password';

// ******************* //
// END CONFIGURATION //
// ******************* //

// initialize the configuration first!
require('./server/config/init')();

const logger = require('./server/lib/logger')();

// load the mongo database
import './server/mongo';

// load the User model
import mongoose from 'mongoose';
const User = mongoose.model('User');

// create the user
const user = new User({
  username: USERNAME,
  password: PASSWORD,
});
user.save((err) => {
  if (err) {
    logger.err(err);
  }

  process.exit();
});
