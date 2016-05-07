import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as movieActions from '../../../app/actions/movie.actions';
import * as types from '../../../app/constants/movie.action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movieActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
        movies: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }],
        skip: 0,
        limit: 20,
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(movieActions);
  });

  describe('loadMovies', () => {
    const LOAD_MOVIES_API = '/api/secure/movies?skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ a: 1 }, { b: 2 }];

        fetchMock.mock(LOAD_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.MOVIES_LOADED, movies: [
            { id: 'foo' },
            { id: 'bar' },
            { id: 'baz' },
            { a: 1 },
            { b: 2 },
          ] },
        ];

        store.dispatch(movieActions.loadMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (401)', () => {
      beforeEach(() => {
        fetchMock.mock(LOAD_MOVIES_API, 401);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.loadMovies())
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
        fetchMock.mock(LOAD_MOVIES_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.loadMovies())
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

  describe('dismissMovie', () => {
    const DISMISS_MOVIE_API = '/api/secure/movies/foo';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(DISMISS_MOVIE_API, 200);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.DISMISSING_MOVIE, payload: undefined },
          { type: types.DISMISSED_MOVIE, movies: [
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
