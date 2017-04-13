import should from 'should';

describe('The http library', () => {
  let res;
  let httpLib;

  beforeEach(() => {
    res = {
      _status: null,
      status(s) {
        this._status = s;
        return this;
      },
      _data: null,
      send(data) {
        this._data = data;
      },
    };

    httpLib = require('../../../server/lib/http');
  });

  it('should exist', () => {
    should.exist(httpLib);
  });

  describe('convertQueryStringToNumber', () => {
    it('should handle a number string', () => {
      should(httpLib.convertQueryStringToNumber('23')).equal(23);
    });

    it('should handle a number', () => {
      should(httpLib.convertQueryStringToNumber(23)).equal(23);
    });

    it('should handle a non-number', () => {
      should(httpLib.convertQueryStringToNumber('foo')).be.undefined();
    });

    it('should handle an empty string', () => {
      should(httpLib.convertQueryStringToNumber('')).be.undefined();
    });
  });

  describe('handleError', () => {
    it('should handle errors', () => {
      httpLib.handleError('BAD THINGS!', 'foo', res);
      should(res._status).equal(500);
      should(res._data).deepEqual({
        error: 'BAD THINGS!',
      });
    });
  });
});
