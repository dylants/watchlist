import reducer from '../../../app/reducers/movies.reducer';
import * as types from '../../../app/constants/action-types';
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
      hasMoreMoviesQueue: true,
      savedMoviesSkip: 0,
      savedMoviesLimit: 20,
      savedMovies: [],
      hasMoreSavedMovies: true,
      dismissedMoviesSkip: 0,
      dismissedMoviesLimit: 20,
      dismissedMovies: [],
      hasMoreDismissedMovies: true,
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
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle saving movie', () => {
      should(
        reducer(state, {
          type: types.SAVING_MOVIE,
        })
      ).deepEqual({
        isWaiting: true,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissing movie', () => {
      should(
        reducer(state, {
          type: types.DISMISSING_MOVIE,
        })
      ).deepEqual({
        isWaiting: true,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle undismissing movie', () => {
      should(
        reducer(state, {
          type: types.UNDISMISSING_MOVIE,
        })
      ).deepEqual({
        isWaiting: true,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle movies already loaded', () => {
      should(
        reducer(state, {
          type: types.MOVIES_ALREADY_LOADED,
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
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

    it('should handle movies queue loaded', () => {
      should(
        reducer(state, {
          type: types.MOVIES_QUEUE_LOADED,
          moviesQueue: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 20,
        moviesQueueLimit: 20,
        moviesQueue: [{ a: 1 }],
        hasMoreMoviesQueue: false,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle saved movies loaded', () => {
      should(
        reducer(state, {
          type: types.SAVED_MOVIES_LOADED,
          savedMovies: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 20,
        savedMoviesLimit: 20,
        savedMovies: [{ a: 1 }],
        hasMoreSavedMovies: false,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissed movies loaded', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIES_LOADED,
          dismissedMovies: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 20,
        dismissedMoviesLimit: 20,
        dismissedMovies: [{ a: 1 }],
        hasMoreDismissedMovies: false,
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
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: 'FAIL!',
      });
    });
  });

  describe('with movies loaded', () => {
    let state;

    beforeEach(() => {
      state = reducer({
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [{ id: 'b', saved: true }, { id: 'y', saved: true }],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
      }, {});
    });

    it('should handle movies queue loaded', () => {
      should(
        reducer(state, {
          type: types.MOVIES_QUEUE_LOADED,
          moviesQueue: [{ id: 'z' }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 4,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }, { id: 'z' }],
        hasMoreMoviesQueue: false,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [{ id: 'b', saved: true }, { id: 'y', saved: true }],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle saved movies loaded', () => {
      should(
        reducer(state, {
          type: types.SAVED_MOVIES_LOADED,
          savedMovies: [{ id: 'z', saved: true }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 4,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
          { id: 'z', saved: true },
        ],
        hasMoreSavedMovies: false,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissed movies loaded', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIES_LOADED,
          dismissedMovies: [{ id: 'z', dismissed: true }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [{ id: 'b', saved: true }, { id: 'y', saved: true }],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 4,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
          { id: 'z', dismissed: true },
        ],
        hasMoreDismissedMovies: false,
        error: null,
      });
    });

    it('should handle saved movie', () => {
      should(
        reducer(state, {
          type: types.SAVED_MOVIE,
          updatedMovie: { id: 'a' },
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 1,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
          { id: 'a' },
        ],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissed movie (moviesQueue)', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIE,
          updatedMovie: { id: 'a', dismissed: true },
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 1,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
        ],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
          { id: 'a', dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissed movie (savedMovies)', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIE,
          updatedMovie: { id: 'b', saved: true, dismissed: true },
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 1,
        savedMoviesLimit: 2,
        savedMovies: [{ id: 'y', saved: true }],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
          { id: 'b', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle undismissed movie (moviesQueue)', () => {
      should(
        reducer(state, {
          type: types.UNDISMISSED_MOVIE,
          updatedMovie: { id: 'c' },
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }, { id: 'c' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
        ],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 1,
        dismissedMoviesLimit: 2,
        dismissedMovies: [{ id: 'd', saved: true, dismissed: true }],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle undismissed movie (savedMovies)', () => {
      should(
        reducer(state, {
          type: types.UNDISMISSED_MOVIE,
          updatedMovie: { id: 'd', saved: true },
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
          { id: 'd', saved: true },
        ],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 1,
        dismissedMoviesLimit: 2,
        dismissedMovies: [{ id: 'c', dismissed: true }],
        hasMoreDismissedMovies: true,
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
        moviesQueueSkip: 2,
        moviesQueueLimit: 2,
        moviesQueue: [{ id: 'a' }, { id: 'x' }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 2,
        savedMoviesLimit: 2,
        savedMovies: [
          { id: 'b', saved: true },
          { id: 'y', saved: true },
        ],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 2,
        dismissedMoviesLimit: 2,
        dismissedMovies: [
          { id: 'c', dismissed: true },
          { id: 'd', saved: true, dismissed: true },
        ],
        hasMoreDismissedMovies: true,
        error: 'bad',
      });
    });
  });

  describe('with a smaller limit initial amount', () => {
    let state;

    beforeEach(() => {
      state = reducer({
        moviesQueueSkip: 0,
        moviesQueueLimit: 1,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 1,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 1,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
      }, {});
    });

    it('should handle loading movies queue', () => {
      should(
        reducer(state, {
          type: types.MOVIES_QUEUE_LOADED,
          moviesQueue: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 1,
        moviesQueueLimit: 1,
        moviesQueue: [{ a: 1 }],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 1,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 1,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle loading saved movies', () => {
      should(
        reducer(state, {
          type: types.SAVED_MOVIES_LOADED,
          savedMovies: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 0,
        moviesQueueLimit: 1,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 1,
        savedMoviesLimit: 1,
        savedMovies: [{ a: 1 }],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 1,
        dismissedMovies: [],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });

    it('should handle dismissed movies loaded', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIES_LOADED,
          dismissedMovies: [{ a: 1 }],
        })
      ).deepEqual({
        isWaiting: false,
        moviesQueueSkip: 0,
        moviesQueueLimit: 1,
        moviesQueue: [],
        hasMoreMoviesQueue: true,
        savedMoviesSkip: 0,
        savedMoviesLimit: 1,
        savedMovies: [],
        hasMoreSavedMovies: true,
        dismissedMoviesSkip: 1,
        dismissedMoviesLimit: 1,
        dismissedMovies: [{ a: 1 }],
        hasMoreDismissedMovies: true,
        error: null,
      });
    });
  });
});
