import should from 'should';

import reducer from '../../../app/reducers/movie-groups.reducer';
import * as types from '../../../app/constants/action-types';
import * as movieTypes from '../../../app/constants/movie-types';

describe('movie groups reducer', () => {
  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have to correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      moviesQueue: {
        loading: false,
        error: null,
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      },
      savedMovies: {
        loading: false,
        error: null,
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      },
      dismissedMovies: {
        loading: false,
        error: null,
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      },
    });
  });

  describe('in the initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {});
    });

    it('should handle a child reducer (moviesReducer) action correctly', () => {
      should(
        reducer(state, {
          type: types.LOADING_MOVIES,
          movieType: movieTypes.SAVED_MOVIES,
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: true,
          error: null,
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
      });
    });
  });

  describe('with movies in each sub-movies state', () => {
    let state;

    beforeEach(() => {
      state = {
        moviesQueue: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'a' },
            { id: 'x' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'b', saved: true },
            { id: 'y', saved: true },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'c', dismissed: true },
            { id: 'd', saved: true, dismissed: true },
          ],
          hasMoreMovies: true,
        },
      };
    });

    it('should handle saved movie correctly', () => {
      should(
        reducer(state, {
          type: types.SAVED_MOVIE,
          updatedMovie: { id: 'a' },
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 1,
          limit: 2,
          movies: [
            { id: 'x' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'b', saved: true },
            { id: 'y', saved: true },
            { id: 'a' },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'c', dismissed: true },
            { id: 'd', saved: true, dismissed: true },
          ],
          hasMoreMovies: true,
        },
      });
    });

    it('should handle dismissed movie (moviesQueue)', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIE,
          updatedMovie: { id: 'a', dismissed: true },
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 1,
          limit: 2,
          movies: [
            { id: 'x' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'b', saved: true },
            { id: 'y', saved: true },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'c', dismissed: true },
            { id: 'd', saved: true, dismissed: true },
            { id: 'a', dismissed: true },
          ],
          hasMoreMovies: true,
        },
      });
    });

    it('should handle dismissed movie (savedMovies)', () => {
      should(
        reducer(state, {
          type: types.DISMISSED_MOVIE,
          updatedMovie: { id: 'b', saved: true, dismissed: true },
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'a' },
            { id: 'x' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 1,
          limit: 2,
          movies: [
            { id: 'y', saved: true },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'c', dismissed: true },
            { id: 'd', saved: true, dismissed: true },
            { id: 'b', saved: true, dismissed: true },
          ],
          hasMoreMovies: true,
        },
      });
    });

    it('should handle undismissed movie (moviesQueue)', () => {
      should(
        reducer(state, {
          type: types.UNDISMISSED_MOVIE,
          updatedMovie: { id: 'c' },
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'a' },
            { id: 'x' },
            { id: 'c' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'b', saved: true },
            { id: 'y', saved: true },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 1,
          limit: 2,
          movies: [
            { id: 'd', saved: true, dismissed: true },
          ],
          hasMoreMovies: true,
        },
      });
    });

    it('should handle undismissed movie (savedMovies)', () => {
      should(
        reducer(state, {
          type: types.UNDISMISSED_MOVIE,
          updatedMovie: { id: 'd', saved: true },
        })
      ).deepEqual({
        moviesQueue: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'a' },
            { id: 'x' },
          ],
          hasMoreMovies: true,
        },
        savedMovies: {
          loading: false,
          error: null,
          skip: 2,
          limit: 2,
          movies: [
            { id: 'b', saved: true },
            { id: 'y', saved: true },
            { id: 'd', saved: true },
          ],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          loading: false,
          error: null,
          skip: 1,
          limit: 2,
          movies: [
            { id: 'c', dismissed: true },
          ],
          hasMoreMovies: true,
        },
      });
    });
  });
});
