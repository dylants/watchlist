import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as movieActions from '../../../app/actions/movie.actions';
import * as types from '../../../app/action-types/movie.action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movieActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(movieActions);
  });

  describe('loadInitialMoviesQueue', () => {
    describe('when movies already exist', () => {
      it('should return the correct state', () => {
        store.dispatch(movieActions.loadInitialMoviesQueue());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED, payload: undefined },
        ]);
      });
    });
  });

  describe('loadInitialSavedMovies', () => {
    describe('when movies already exist', () => {
      beforeEach(() => {
        store = mockStore({
          moviesState: {
            savedMoviesSkip: 0,
            savedMoviesLimit: 20,
            savedMovies: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
          },
        });
      });

      it('should return the correct state', () => {
        store.dispatch(movieActions.loadInitialSavedMovies());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED, payload: undefined },
        ]);
      });
    });
  });

  describe('loadInitialDismissedMovies', () => {
    describe('when movies already exist', () => {
      beforeEach(() => {
        store = mockStore({
          moviesState: {
            dismissedMoviesSkip: 0,
            dismissedMoviesLimit: 20,
            dismissedMovies: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
          },
        });
      });

      it('should return the correct state', () => {
        store.dispatch(movieActions.loadInitialDismissedMovies());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED, payload: undefined },
        ]);
      });
    });
  });

  describe('loadMoviesQueue', () => {
    const LOAD_MOVIES_QUEUE_API = '/api/secure/movies?saved=false&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ a: 1 }, { b: 2 }];

        fetchMock.mock(LOAD_MOVIES_QUEUE_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.MOVIES_QUEUE_LOADED, moviesQueue: [
            { id: 'foo' },
            { id: 'bar' },
            { id: 'baz' },
            { a: 1 },
            { b: 2 },
          ] },
        ];

        store.dispatch(movieActions.loadMoviesQueue())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      describe('loadInitialMoviesQueue, when no movies exist in store', () => {
        beforeEach(() => {
          store = mockStore({
            moviesState: {
              moviesQueueSkip: 0,
              moviesQueueLimit: 20,
              moviesQueue: [],
            },
          });
        });

        it('should return the correct state', (done) => {
          store.dispatch(movieActions.loadInitialMoviesQueue())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES, payload: undefined },
                { type: types.MOVIES_QUEUE_LOADED, moviesQueue: [
                  { a: 1 },
                  { b: 2 },
                ] },
              ]);
            })
            .then(done)   // testing complete
            .catch(done); // we do this in case the tests fail, to end tests
        });
      });
    });

    describe('when the API call fails (401)', () => {
      beforeEach(() => {
        fetchMock.mock(LOAD_MOVIES_QUEUE_API, 401);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.loadMoviesQueue())
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(2);
            should(actions[0].type).equal(types.LOADING_MOVIES);
            should(actions[1].payload.args).deepEqual(['/login']);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock(LOAD_MOVIES_QUEUE_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.loadMoviesQueue())
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(2);
            should(actions[0].type).equal(types.LOADING_MOVIES);
            should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });

  describe('loadSavedMovies', () => {
    const LOAD_SAVED_MOVIES_API = '/api/secure/movies?saved=true&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ a: 1 }, { b: 2 }];

        fetchMock.mock(LOAD_SAVED_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.SAVED_MOVIES_LOADED, savedMovies: [
            { id: 'foo' },
            { id: 'bar' },
            { id: 'baz' },
            { a: 1 },
            { b: 2 },
          ] },
        ];

        store.dispatch(movieActions.loadSavedMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      describe('loadInitialSavedMovies, when no movies exist in store', () => {
        beforeEach(() => {
          store = mockStore({
            moviesState: {
              savedMoviesSkip: 0,
              savedMoviesLimit: 20,
              savedMovies: [],
            },
          });
        });

        it('should return the correct state', (done) => {
          store.dispatch(movieActions.loadInitialSavedMovies())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES, payload: undefined },
                { type: types.SAVED_MOVIES_LOADED, savedMovies: [
                  { a: 1 },
                  { b: 2 },
                ] },
              ]);
            })
            .then(done)   // testing complete
            .catch(done); // we do this in case the tests fail, to end tests
        });
      });
    });
  });

  describe('loadDismissedMovies', () => {
    const LOAD_DISMISSED_MOVIES_API = '/api/secure/movies?dismissed=true&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ a: 1 }, { b: 2 }];

        fetchMock.mock(LOAD_DISMISSED_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.DISMISSED_MOVIES_LOADED, dismissedMovies: [
            { id: 'foo' },
            { id: 'bar' },
            { id: 'baz' },
            { a: 1 },
            { b: 2 },
          ] },
        ];

        store.dispatch(movieActions.loadDismissedMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      describe('loadInitialSavedMovies, when no movies exist in store', () => {
        beforeEach(() => {
          store = mockStore({
            moviesState: {
              dismissedMoviesSkip: 0,
              dismissedMoviesLimit: 20,
              dismissedMovies: [],
            },
          });
        });

        it('should return the correct state', (done) => {
          store.dispatch(movieActions.loadInitialDismissedMovies())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES, payload: undefined },
                { type: types.DISMISSED_MOVIES_LOADED, dismissedMovies: [
                  { a: 1 },
                  { b: 2 },
                ] },
              ]);
            })
            .then(done)   // testing complete
            .catch(done); // we do this in case the tests fail, to end tests
        });
      });
    });
  });

  describe('dismissMovie', () => {
    const DISMISS_MOVIE_API = '/api/secure/movies/foo';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(DISMISS_MOVIE_API, 200);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.DISMISSING_MOVIE, payload: undefined },
          { type: types.DISMISSED_MOVIE, moviesQueue: [
            { id: 'bar' },
            { id: 'baz' },
          ] },
        ];

        store.dispatch(movieActions.dismissMovie('foo'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock(DISMISS_MOVIE_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.dismissMovie('foo'))
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(2);
            should(actions[0].type).equal(types.DISMISSING_MOVIE);
            should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });
});
