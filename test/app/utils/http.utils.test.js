import should from 'should';

const MODULE_PATH = '../../../app/utils/http.utils';

describe('App utils', () => {
  let utils;

  beforeEach(() => {
    utils = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(utils);
  });

  describe('checkHttpStatus', () => {
    let response;

    beforeEach(() => {
      response = {
        a: 1,
      };
    });

    describe('with a response status 200', () => {
      beforeEach(() => {
        response.status = 200;
      });

      it('should return the response', () => {
        should(utils.checkHttpStatus(response)).deepEqual(response);
      });
    });

    describe('with a response status 400', () => {
      beforeEach(() => {
        response.status = 400;
      });

      it('should throw an error', () => {
        should.throws(() => utils.checkHttpStatus(response));
      });
    });
  });

  describe('handleHttpError', () => {
    let dispatch;
    let dispatchResult;
    let error;
    let errorAction;

    beforeEach(() => {
      dispatch = (result) => {
        dispatchResult = result;
      };

      error = {
        response: {},
      };

      errorAction = (err) => err;
    });

    describe('when the error is unauthorized', () => {
      beforeEach(() => {
        error.response.status = 401;
      });

      it('should send to login', () => {
        utils.handleHttpError(dispatch, error, errorAction);
        should(dispatchResult).be.ok();
        should(dispatchResult.payload.args).deepEqual(['/login']);
      });
    });

    describe('when the error is NOT unauthorized', () => {
      beforeEach(() => {
        error.response.status = 500;
      });

      it('should dispatch the error', () => {
        utils.handleHttpError(dispatch, error, errorAction);
        should(dispatchResult).be.ok();
        should(dispatchResult).equal(error);
      });
    });

    describe('when the error is NOT unauthorized with extra args', () => {
      let a;
      let b;
      let c;

      beforeEach(() => {
        error.response.status = 500;

        errorAction = (err, x, y, z) => {
          a = x;
          b = y;
          c = z;
          return err;
        };
      });

      it('should dispatch the error correctly', () => {
        utils.handleHttpError(dispatch, error, errorAction, '1', 2);
        should(dispatchResult).be.ok();
        should(dispatchResult).equal(error);
        should(a).equal('1');
        should(b).equal(2);
        should(c).be.undefined();
      });
    });
  });
});
