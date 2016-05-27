import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as savedMoviesActions from '../../../app/actions/saved-movies.actions';
import * as types from '../../../app/constants/action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('saved-movies.actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
        savedMoviesSkip: 0,
        savedMoviesLimit: 20,
        savedMovies: [{ id: 'd' }, { id: 'e' }, { id: 'f' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(savedMoviesActions);
  });

  describe('loadInitialSavedMovies', () => {
    describe('when movies already exist', () => {
      it('should return the correct state', () => {
        store.dispatch(savedMoviesActions.loadInitialSavedMovies());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED },
        ]);
      });
    });
  });

  describe('loadSavedMovies', () => {
    const LOAD_SAVED_MOVIES_API = '/api/secure/movies?saved=true&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ id: 'x' }, { id: 'y' }, { id: 'f' }];

        fetchMock.mock(LOAD_SAVED_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES },
          {
            type: types.SAVED_MOVIES_LOADED,
            savedMovies: [
              { id: 'd' },
              { id: 'e' },
              { id: 'f' },
              { id: 'x' },
              { id: 'y' },
            ],
          },
        ];

        store.dispatch(savedMoviesActions.loadSavedMovies())
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
          store.dispatch(savedMoviesActions.loadInitialSavedMovies())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES },
                {
                  type: types.SAVED_MOVIES_LOADED,
                  savedMovies: [
                    { id: 'x' },
                    { id: 'y' },
                    { id: 'f' },
                  ],
                },
              ]);
            })
            .then(done)   // testing complete
            .catch(done); // we do this in case the tests fail, to end tests
        });
      });
    });

    describe('when the API call fails (401)', () => {
      beforeEach(() => {
        fetchMock.mock(LOAD_SAVED_MOVIES_API, 401);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(savedMoviesActions.loadSavedMovies())
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
        fetchMock.mock(LOAD_SAVED_MOVIES_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(savedMoviesActions.loadSavedMovies())
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
});
