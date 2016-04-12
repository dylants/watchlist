import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';

const User = mongoose.model('User');

function authenticateUser(user, password, callback) {
  if (!user) {
    // we know the user doesn't exist, but don't inform
    // the client about that (for security reasons)
    return callback(null, false, {
      message: 'Unauthorized',
    });
  }

  // verify if the password is valid
  return user.isPasswordValid(password, (pwError, isValid) => {
    // if any problems, error out
    if (pwError) {
      return callback(pwError);
    }

    // only return the user if the password is valid
    if (isValid) {
      // remove sensitive data prior to login
      const returnUser = user.toJSON();
      delete returnUser.password;

      return callback(null, returnUser);
    } else {
      // we know the password is incorrect, but don't
      // inform the cilent about this (for security reasons)
      return callback(null, false, {
        message: 'Unauthorized',
      });
    }
  });
}

// Serialize sessions
passport.serializeUser((user, done) => done(null, user._id));

// Deserialize sessions
passport.deserializeUser((id, done) => {
  // find the user by ID, but don't include the password in response
  User.findById(id, '-password', (err, user) => {
    done(err, user ? user.toJSON() : user);
  });
});

// The strategy used when authenticating a user
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  // find the user based off the username
  User.findOne({
    username,
  }).select('+password').exec((findErr, user) => {
    // if any problems, error out
    if (findErr) {
      return done(findErr);
    }

    return authenticateUser(user, password, done);
  });
}));
