import reducer from '../../../app/reducers/loginReducer';
import * as types from '../../../app/constants/loginActionTypes';
import should from 'should';

describe('login reducer', () => {
  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have to correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      isWaiting: false,
      user: null,
      error: null,
    });
  });

  describe('in the initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {});
    });

    it('should handle login initiated correctly', () => {
      should(
        reducer(state, {
          type: types.LOGIN_INITIATED,
        })
      ).deepEqual({
        isWaiting: true,
        user: null,
        error: null,
      });
    });
  });

  describe('in the loading state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {
        type: types.LOGIN_INITIATED,
      });
    });

    it('should handle login success correctly', () => {
      should(
        reducer(state, {
          type: types.LOGIN_SUCCESS,
          user: 'biff',
        })
      ).deepEqual({
        isWaiting: false,
        user: 'biff',
        error: null,
      });
    });

    it('should handle login error correctly', () => {
      should(
        reducer(state, {
          type: types.LOGIN_ERROR,
          error: 'bad!',
        })
      ).deepEqual({
        isWaiting: false,
        user: null,
        error: 'bad!',
      });
    });
  });
});
