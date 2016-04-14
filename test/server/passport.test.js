import should from 'should';
import rewire from 'rewire';

import testHelper from './test-helper';

const MODULE_PATH = '../../server/passport';

describe('The passport configuration', () => {
  let passport;

  before(() => {
    // create fake mongoose models
    testHelper.loadMongooseModels();
  });

  after(() => {
    // clear 'fake' models after tests complete
    testHelper.clearMongooseModels();
  });

  beforeEach(() => {
    passport = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(passport);
  });

  describe('authenticateUser', () => {
    let authenticateUser;
    let USER;

    beforeEach(() => {
      passport = rewire(MODULE_PATH);
      authenticateUser = passport.__get__('authenticateUser');

      USER = {
        isPasswordValid(password, callback) {
          if (password === 'password') {
            return callback(null, true);
          } else {
            return callback(null, false);
          }
        },

        toJSON() {
          return {
            password: 'password',
            a: 1,
          };
        },
      };
    });

    describe('when the user does not exist', () => {
      it('should return Unauthorized', (done) => {
        authenticateUser(null, 'pw', (err, user, info) => {
          should(err).be.null();
          should(user).be.false();
          should(info).deepEqual({
            message: 'Unauthorized',
          });

          done();
        });
      });
    });

    describe('when the password is valid', () => {
      it('should return the user without the password', (done) => {
        authenticateUser(USER, 'password', (err, user, info) => {
          should(err).be.null();
          should(user).deepEqual({
            a: 1,
          });
          should(info).be.undefined();

          done();
        });
      });
    });

    describe('when the password is valid', () => {
      it('should return Unauthorized', (done) => {
        authenticateUser(USER, 'bad', (err, user, info) => {
          should(err).be.null();
          should(user).be.false();
          should(info).deepEqual({
            message: 'Unauthorized',
          });

          done();
        });
      });
    });
  });
});
