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
        moviesQueue: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [{ id: 'd' }, { id: 'e' }, { id: 'f' }],
        dismissedMoviesSkip: 0,
        dismissedMoviesLimit: 20,
        dismissedMovies: [{ id: 'g' }, { id: 'h' }, { id: 'i' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(movieActions);
  });

  describe('saveMovie', () => {
    const SAVE_MOVIE_API = '/api/secure/movies/a';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(SAVE_MOVIE_API, 200);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.SAVING_MOVIE },
          {
            type: types.SAVED_MOVIE,
            moviesQueue: [{ id: 'b' }, { id: 'c' }],
            savedMovies: [{ id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'a' }],
          },
        ];

        store.dispatch(movieActions.saveMovie('a'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock(SAVE_MOVIE_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.saveMovie('a'))
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(2);
            should(actions[0].type).equal(types.SAVING_MOVIE);
            should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });

  describe('dismissMovie', () => {
    const DISMISS_MOVIE_API = '/api/secure/movies/a';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(DISMISS_MOVIE_API, 200);
        fetchMock.mock('/api/secure/movies/d', 200);
      });

      it('should return the correct actions (moviesQueue)', (done) => {
        const expectedActions = [
          { type: types.DISMISSING_MOVIE },
          {
            type: types.DISMISSED_MOVIE,
            moviesQueue: [{ id: 'b' }, { id: 'c' }],
            savedMovies: [{ id: 'd' }, { id: 'e' }, { id: 'f' }],
            dismissedMovies: [{ id: 'g' }, { id: 'h' }, { id: 'i' }, { id: 'a' }],
          },
        ];

        store.dispatch(movieActions.dismissMovie('a'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      it('should return the correct actions (savedMovies)', (done) => {
        const expectedActions = [
          { type: types.DISMISSING_MOVIE },
          {
            type: types.DISMISSED_MOVIE,
            moviesQueue: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
            savedMovies: [{ id: 'e' }, { id: 'f' }],
            dismissedMovies: [{ id: 'g' }, { id: 'h' }, { id: 'i' }, { id: 'd' }],
          },
        ];

        store.dispatch(movieActions.dismissMovie('d'))
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
        store.dispatch(movieActions.dismissMovie('a'))
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

  describe('undismissMovie', () => {
    beforeEach(() => {
      store = mockStore({
        moviesState: {
          moviesQueue: [{ id: 'a', saved: false }, { id: 'b', saved: false }],
          savedMovies: [{ id: 'd', saved: true }, { id: 'e', saved: true }],
          dismissedMovies: [{ id: 'g', saved: true }, { id: 'h', saved: false }],
        },
      });
    });

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock('/api/secure/movies/g', 200);
        fetchMock.mock('/api/secure/movies/h', 200);
      });

      it('should return the correct actions (moviesQueue)', (done) => {
        const expectedActions = [
          { type: types.UNDISMISSING_MOVIE },
          {
            type: types.UNDISMISSED_MOVIE,
            moviesQueue: [
              { id: 'a', saved: false },
              { id: 'b', saved: false },
              { id: 'h', saved: false },
            ],
            savedMovies: [{ id: 'd', saved: true }, { id: 'e', saved: true }],
            dismissedMovies: [{ id: 'g', saved: true }],
          },
        ];

        store.dispatch(movieActions.undismissMovie('h'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      it('should return the correct actions (savedMovies)', (done) => {
        const expectedActions = [
          { type: types.UNDISMISSING_MOVIE },
          {
            type: types.UNDISMISSED_MOVIE,
            moviesQueue: [{ id: 'a', saved: false }, { id: 'b', saved: false }],
            savedMovies: [
              { id: 'd', saved: true },
              { id: 'e', saved: true },
              { id: 'g', saved: true },
            ],
            dismissedMovies: [{ id: 'h', saved: false }],
          },
        ];

        store.dispatch(movieActions.undismissMovie('g'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock('/api/secure/movies/g', 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.undismissMovie('g'))
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(2);
            should(actions[0].type).equal(types.UNDISMISSING_MOVIE);
            should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });
});
