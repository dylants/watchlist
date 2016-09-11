import should from 'should';
import _ from 'lodash';

import reducer from '../../../app/reducers/movies.reducer';
import * as types from '../../../app/constants/action-types';

describe('movies reducer', () => {
  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have to correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      loading: false,
      error: null,
      skip: 0,
      limit: 20,
      movies: [],
      hasMoreMovies: true,
    });
  });

  /* ----------------------------------------------------------------- *
   * ----------------------- INITIAL STATE --------------------------- *
   * ----------------------------------------------------------------- */

  describe('in the initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {});
    });

    it('should handle loading movies correctly', () => {
      should(
        reducer(state, {
          type: types.LOADING_MOVIES,
        })
      ).deepEqual({
        loading: true,
        error: null,
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      });
    });

    it('should handle add movie correctly', () => {
      const movie = { id: 'foo' };
      should(
        reducer(state, {
          type: types.ADD_MOVIE,
          updatedMovie: movie,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 0,
        limit: 20,
        movies: [{ id: 'foo' }],
        hasMoreMovies: true,
      });
    });

    it('should handle remove movie correctly', () => {
      const movie = { id: 1 };
      should(
        reducer(state, {
          type: types.REMOVE_MOVIE,
          updatedMovie: movie,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      });
    });
  });

  /* ----------------------------------------------------------------- *
   * ----------------------- LOADING STATE --------------------------- *
   * ----------------------------------------------------------------- */

  describe('in the loading state', () => {
    let state;

    beforeEach(() => {
      state = reducer(undefined, {
        type: types.LOADING_MOVIES,
      });
    });

    it('should handle failed loading movies correctly', () => {
      should(
        reducer(state, {
          type: types.FAILED_LOADING_MOVIES,
          error: 'bad',
        })
      ).deepEqual({
        loading: false,
        error: 'bad',
        skip: 0,
        limit: 20,
        movies: [],
        hasMoreMovies: true,
      });
    });

    it('should handle movies loaded correctly (with more movies)', () => {
      const movies = _.times(20, index => ({ id: index }));
      should(
        reducer(state, {
          type: types.MOVIES_LOADED,
          movies,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 20,
        limit: 20,
        movies,
        hasMoreMovies: true,
      });
    });

    it('should handle movies loaded correctly (with NO more movies)', () => {
      const movies = _.times(5, index => ({ id: index }));
      should(
        reducer(state, {
          type: types.MOVIES_LOADED,
          movies,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 20,
        limit: 20,
        movies,
        hasMoreMovies: false,
      });
    });
  });

  /* ----------------------------------------------------------------- *
   * ------------------- MOVIES ALREADY LOADED ----------------------- *
   * ----------------------------------------------------------------- */

  describe('with movies already loaded', () => {
    let state;
    let movies;

    beforeEach(() => {
      movies = _.times(20, index => ({ id: index }));
      state = reducer(undefined, {
        type: types.MOVIES_LOADED,
        movies,
      });
    });

    it('should handle loading movies correctly', () => {
      should(
        reducer(state, {
          type: types.LOADING_MOVIES,
        })
      ).deepEqual({
        loading: true,
        error: null,
        skip: 20,
        limit: 20,
        movies,
        hasMoreMovies: true,
      });
    });

    it('should handle updating movie correctly', () => {
      should(
        reducer(state, {
          type: types.UPDATING_MOVIE,
        })
      ).deepEqual({
        loading: true,
        error: null,
        skip: 20,
        limit: 20,
        movies,
        hasMoreMovies: true,
      });
    });

    it('should handle add movie correctly (when movie does not exist already)', () => {
      const movie = { id: 'foo' };
      should(
        reducer(state, {
          type: types.ADD_MOVIE,
          updatedMovie: movie,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 20,
        limit: 20,
        movies: movies.concat(movie),
        hasMoreMovies: true,
      });
    });

    it('should handle add movie correctly (when movie already exists)', () => {
      const movie = { id: 1 };
      should(
        reducer(state, {
          type: types.ADD_MOVIE,
          updatedMovie: movie,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 20,
        limit: 20,
        movies,
        hasMoreMovies: true,
      });
    });

    it('should handle remove movie correctly', () => {
      const movie = { id: 1 };
      should(
        reducer(state, {
          type: types.REMOVE_MOVIE,
          updatedMovie: movie,
        })
      ).deepEqual({
        loading: false,
        error: null,
        skip: 19,
        limit: 20,
        movies: movies.slice(0, 1).concat(movies.slice(2)),
        hasMoreMovies: true,
      });
    });

    /* ******************************* *
     * -------- LOADING STATE -------- *
     * ******************************* */

    describe('in the loading state', () => {
      beforeEach(() => {
        state = reducer(state, {
          type: types.LOADING_MOVIES,
        });
      });

      it('should handle movies already loaded correctly', () => {
        should(
          reducer(state, {
            type: types.MOVIES_ALREADY_LOADED,
          })
        ).deepEqual({
          loading: false,
          error: null,
          skip: 20,
          limit: 20,
          movies,
          hasMoreMovies: true,
        });
      });

      it('should handle failed loading movies correctly', () => {
        should(
          reducer(state, {
            type: types.FAILED_LOADING_MOVIES,
            error: 'bad',
          })
        ).deepEqual({
          loading: false,
          error: 'bad',
          skip: 20,
          limit: 20,
          movies,
          hasMoreMovies: true,
        });
      });

      it('should handle movies loaded correctly (with new movies and more movies)', () => {
        const newMovies = _.times(20, index => ({ id: index + 20 }));
        should(
          reducer(state, {
            type: types.MOVIES_LOADED,
            movies: newMovies,
          })
        ).deepEqual({
          loading: false,
          error: null,
          skip: 40,
          limit: 20,
          movies: movies.concat(newMovies),
          hasMoreMovies: true,
        });
      });

      it('should handle movies loaded correctly (with some new movies and more movies)', () => {
        // these movies are going to have ids of 0, 2, 4, 6, 8, etc
        const newMovies = _.times(20, index => ({ id: index * 2 }));
        // since we have ids 0 - 20, the first 10 won't be added
        const newMoviesAdded = newMovies.slice(10);
        should(
          reducer(state, {
            type: types.MOVIES_LOADED,
            movies: newMovies,
          })
        ).deepEqual({
          loading: false,
          error: null,
          skip: 40,
          limit: 20,
          movies: movies.concat(newMoviesAdded),
          hasMoreMovies: true,
        });
      });

      it('should handle movies loaded correctly (with new movies and NO more movies)', () => {
        const newMovies = _.times(10, index => ({ id: index + 20 }));
        should(
          reducer(state, {
            type: types.MOVIES_LOADED,
            movies: newMovies,
          })
        ).deepEqual({
          loading: false,
          error: null,
          skip: 40,
          limit: 20,
          movies: movies.concat(newMovies),
          hasMoreMovies: false,
        });
      });

      it('should handle movies loaded correctly (with no new and no more movies)', () => {
        should(
          reducer(state, {
            type: types.MOVIES_LOADED,
            movies: [],
          })
        ).deepEqual({
          loading: false,
          error: null,
          skip: 40,
          limit: 20,
          movies,
          hasMoreMovies: false,
        });
      });
    });

    /* ******************************* *
     * -------- UPDATING STATE ------- *
     * ******************************* */

    describe('in the updating state', () => {
      beforeEach(() => {
        state = reducer(state, {
          type: types.UPDATING_MOVIES,
        });
      });

      it('should handle failed updating movie correctly', () => {
        should(
          reducer(state, {
            type: types.FAILED_UPDATING_MOVIE,
            error: 'bad',
          })
        ).deepEqual({
          loading: false,
          error: 'bad',
          skip: 20,
          limit: 20,
          movies,
          hasMoreMovies: true,
        });
      });
    });
  });
});
