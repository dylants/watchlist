import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as dismissedMoviesActions from '../../../app/actions/dismissed-movies.actions';
import * as types from '../../../app/action-types/movie.action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('dismissed-movies.actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
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
    should.exist(dismissedMoviesActions);
  });

  describe('loadInitialDismissedMovies', () => {
    describe('when movies already exist', () => {
      it('should return the correct state', () => {
        store.dispatch(dismissedMoviesActions.loadInitialDismissedMovies());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED },
        ]);
      });
    });
  });

  describe('loadDismissedMovies', () => {
    const LOAD_DISMISSED_MOVIES_API = '/api/secure/movies?dismissed=true&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ id: 'x' }, { id: 'y' }, { id: 'i' }];

        fetchMock.mock(LOAD_DISMISSED_MOVIES_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES },
          {
            type: types.DISMISSED_MOVIES_LOADED,
            dismissedMovies: [
              { id: 'g' },
              { id: 'h' },
              { id: 'i' },
              { id: 'x' },
              { id: 'y' },
            ],
          },
        ];

        store.dispatch(dismissedMoviesActions.loadDismissedMovies())
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });

      describe('loadInitialDismissedMovies, when no movies exist in store', () => {
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
          store.dispatch(dismissedMoviesActions.loadInitialDismissedMovies())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES },
                {
                  type: types.DISMISSED_MOVIES_LOADED,
                  dismissedMovies: [
                    { id: 'x' },
                    { id: 'y' },
                    { id: 'i' },
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
        fetchMock.mock(LOAD_DISMISSED_MOVIES_API, 401);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(dismissedMoviesActions.loadDismissedMovies())
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
        fetchMock.mock(LOAD_DISMISSED_MOVIES_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(dismissedMoviesActions.loadDismissedMovies())
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
