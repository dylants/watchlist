import should from 'should';
import proxyquire from 'proxyquire';

const MODULE_PATH = '../../../server/models/user';

function mockUser(mongoose, bcrypt) {
  return proxyquire(MODULE_PATH, {
    mongoose,
    bcrypt,
  });
}

describe('The User schema', () => {
  let User;

  beforeEach(() => {
    User = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(User);
  });

  describe('pre-save', () => {
    let user;
    let mongoose;
    let bcrypt;

    beforeEach(() => {
      user = {
        isModified() {
          return true;
        },

        password: 'password',
      };

      mongoose = {
        Schema() {
          this.pre = function pre(name, callback) {
            function done() {}

            const boundCallback = callback.bind(user);

            return boundCallback(done);
          };

          this.plugin = () => {};

          this.methods = {};
        },

        model() {},
      };

      bcrypt = {
        genSalt(routes, callback) {
          return callback(null, 1);
        },

        hash(password, salt, callback) {
          return callback(null, 'hash!');
        },
      };
    });

    describe('when the password has been modified', () => {
      beforeEach(() => {
        User = mockUser(mongoose, bcrypt);
      });

      it('should hash the password', () => {
        should(user.password).equal('hash!');
      });
    });

    describe('when the password has not been modified', () => {
      beforeEach(() => {
        user.isModified = () => false;
        User = mockUser(mongoose, bcrypt);
      });

      it('should NOT has the password', () => {
        should(user.password).equal('password');
      });
    });
  });
});
