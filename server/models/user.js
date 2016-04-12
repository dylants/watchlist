import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import createdModifiedPlugin from './plugins/created-modified';

const logger = require('../lib/logger')();
const Schema = mongoose.Schema;

const SALT_ROUNDS = 15;

const UserSchema = new Schema({
  username: String,
  password: {
    type: String,
    select: false,
  },
});

// include created and modified dates
UserSchema.plugin(createdModifiedPlugin);

// never save the password in plaintext, always a hash of it
UserSchema.pre('save', function save(next) {
  const user = this;

  logger.log('pre-save hook for saving password hash...');

  // but only perform these checks if the password was modified
  if (!user.isModified('password')) {
    logger.log('pre-save hook for saving password hash complete, no password update');
    return next();
  }

  // use bcrypt to generate a salt
  return bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) {
      logger.error('error generating salt: ', err);
      return next(err);
    }

    // using the generated salt, use bcrypt to generate a hash of the password
    return bcrypt.hash(user.password, salt, (err2, hash) => {
      if (err2) {
        logger.error('error generating hash: ', err2);
        return next(err2);
      }

      // store the password hash as the password
      user.password = hash;
      logger.log('pre-save hook for saving password hash successful');
      return next();
    });
  });
});

UserSchema.methods.isPasswordValid = function isPasswordValid(rawPassword, callback) {
  bcrypt.compare(rawPassword, this.password, (err, same) => {
    if (err) {
      logger.error('isPasswordValid: Error comparing passwords: ', err);
      return callback(err);
    }

    return callback(null, same);
  });
};

mongoose.model('User', UserSchema);
