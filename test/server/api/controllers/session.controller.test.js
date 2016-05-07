import should from 'should';
import proxyquire from 'proxyquire';

const MODULE_PATH = '../../../../server/api/controllers/session.controller';

function mockSession(passport) {
  return proxyquire(MODULE_PATH, {
    passport,
  });
}

describe('The session controller', () => {
  let controller;

  beforeEach(() => {
    controller = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(controller);
  });

  describe('login', () => {
    let req;
    let res;
    let next;
    let nextError;

    beforeEach(() => {
      req = {
        logIn(user, callback) {
          return callback(null);
        },
      };

      res = {
        _code: null,
        _message: null,
        status(code) {
          this._code = code;
          return this;
        },

        send(message) {
          this._message = message;
        },
      };

      next = (err) => {
        nextError = err;
      };

      nextError = null;

      controller = mockSession({
        authenticate(name, callback) {
          callback(null, 'bob');
          return function authenticate() {};
        },
      });
    });

    it('should work', () => {
      controller.login(req, res, next);
      should(nextError).be.null();
      should(res._code).equal(201);
      should(res._message).equal('bob');
    });

    describe('when passport.authenticate has error', () => {
      beforeEach(() => {
        controller = mockSession({
          authenticate(name, callback) {
            callback('Error!');
            return function authenticate() {};
          },
        });
      });

      it('should return next error', () => {
        controller.login(req, res, next);
        should(nextError).equal('Error!');
      });
    });

    describe('when passport.authenticate returns no user', () => {
      beforeEach(() => {
        controller = mockSession({
          authenticate(name, callback) {
            callback(null, null, {
              message: 'bad things',
            });
            return function authenticate() {};
          },
        });
      });

      it('should return 401', () => {
        controller.login(req, res, next);
        should(nextError).be.null();
        should(res._code).equal(401);
        should(res._message).deepEqual({
          error: 'bad things',
        });
      });
    });

    describe('when req.logIn returns error', () => {
      beforeEach(() => {
        req.logIn = (user, callback) => callback('bad!');
      });

      it('should return 401', () => {
        controller.login(req, res, next);
        should(nextError).equal('bad!');
      });
    });
  });

  describe('logout', () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        _logoutCalled: false,
        logout() {
          this._logoutCalled = true;
        },
      };

      res = {
        _code: null,
        _message: null,
        status(code) {
          this._code = code;
          return this;
        },

        end() {},
      };
    });

    it('should work', () => {
      controller.logout(req, res);
      should(req._logoutCalled).be.true();
      should(res._code).equal(204);
    });
  });
});
