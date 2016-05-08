import reducer from '../../../app/reducers/movies.reducer';
import * as types from '../../../app/constants/movie.action-types';
import should from 'should';

describe('movies reducer', () => {
  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have to correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      isWaiting: false,
      moviesQueueSkip: 0,
      moviesQueueLimit: 20,
      moviesQueue: [],
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
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        error: null,
      });
    });

    it('should handle dismissed movie', () => {
      should(
        reducer(state, {
          type: types.DISMISSING_MOVIE,
        })
      ).deepEqual({
        isWaiting: true,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        error: null,
      });
    });
  });

  describe('in loading state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {
        type: types.LOADING_MOVIES,
      });
    });

    it('should handle movies loaded', () => {
      should(
        reducer(state, {
          type: types.MOVIES_QUEUE_LOADED,
          moviesQueue: [
            {
              a: 1,
            },
          ],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 20,
        moviesQueueLimit: 20,
        moviesQueue: [
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
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        error: 'FAIL!',
      });
    });
  });

  describe('with movies loaded', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {
        type: types.MOVIES_QUEUE_LOADED,
        moviesQueue: [{ a: 1 }, { b: 2 }],
      });
    });

    it('should handle dismissed movie', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIE,
          moviesQueue: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 20,
        moviesQueueLimit: 20,
        moviesQueue: [{ a: 1 }],
        error: null,
      });
    });

    it('should handle failed updating movie', () => {
      should(
        reducer(state, {
          type: types.FAILED_UPDATING_MOVIE,
          error: 'bad',
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 20,
        moviesQueueLimit: 20,
        moviesQueue: [{ a: 1 }, { b: 2 }],
        error: 'bad',
      });
    });
  });
});
