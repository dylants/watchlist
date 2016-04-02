import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as movieActions from '../../../app/actions/movieActions';
import * as types from '../../../app/constants/movieActionTypes';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movieActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(movieActions);
  });

  describe('loadMovies', () => {
    const LOAD_MOVIES_API = '/api/movies';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ a: 1 }, { b: 2 }];

        fetchMock.mock(LOAD_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.MOVIES_LOADED, movies: MOVIES },
        ];

        store.dispatch(movieActions.loadMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails', () => {
      beforeEach(() => {
        fetchMock.mock(LOAD_MOVIES_API, 500);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES, payload: undefined },
          { type: types.FAILED_LOADING_MOVIES, error: new SyntaxError('Unexpected end of input') },
        ];

        store.dispatch(movieActions.loadMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });
});
