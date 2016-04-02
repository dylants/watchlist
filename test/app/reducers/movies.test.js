import reducer from '../../../app/reducers/movies';
import * as types from '../../../app/constants/movieActionTypes';
import should from 'should';

describe('movies reducer', () => {
  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have to correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      isWaiting: false,
      movies: [],
      error: null,
    });
  });

  describe('in the initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {});
    });

    it('should handle loading movies successfully', () => {
      should(
        reducer(state, {
          type: types.LOADING_MOVIES,
        })
      ).deepEqual({
        isWaiting: true,
        movies: [],
        error: null,
      });
    });

    describe('in loading state', () => {
      beforeEach(() => {
        state = reducer(state, {
          type: types.LOADING_MOVIES,
        });
      });

      it('should handle movies loaded', () => {
        should(
          reducer(state, {
            type: types.MOVIES_LOADED,
            movies: [
              {
                a: 1,
              },
            ],
          })
        ).deepEqual({
          isWaiting: false,
          movies: [
            {
              a: 1,
            },
          ],
          error: null,
        });
      });

      it('should handle failed loading movies', () => {
        should(
          reducer(state, {
            type: types.FAILED_LOADING_MOVIES,
            error: 'FAIL!',
          })
        ).deepEqual({
          isWaiting: false,
          movies: [],
          error: 'FAIL!',
        });
      });
    });
  });
});
