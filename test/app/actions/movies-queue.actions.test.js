import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as moviesQueueActions from '../../../app/actions/movies-queue.actions';
import * as types from '../../../app/constants/action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movies-queue.actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
        moviesQueueSkip: 0,
        moviesQueueLimit: 20,
        moviesQueue: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(moviesQueueActions);
  });

  describe('loadInitialMoviesQueue', () => {
    describe('when movies already exist', () => {
      it('should return the correct state', () => {
        store.dispatch(moviesQueueActions.loadInitialMoviesQueue());
        should(store.getActions()).deepEqual([
          { type: types.MOVIES_ALREADY_LOADED },
        ]);
      });
    });
  });

  describe('loadMoviesQueue', () => {
    const LOAD_MOVIES_QUEUE_API = '/api/secure/movies?saved=false&skip=0&limit=20';

    describe('when movies are returned', () => {
      let MOVIES;

      beforeEach(() => {
        MOVIES = [{ id: 'x' }, { id: 'y' }, { id: 'c' }];

        fetchMock.mock(LOAD_MOVIES_QUEUE_API, MOVIES);
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.LOADING_MOVIES },
          {
            type: types.MOVIES_QUEUE_LOADED,
            moviesQueue: [
              { id: 'a' },
              { id: 'b' },
              { id: 'c' },
              { id: 'x' },
              { id: 'y' },
            ],
          },
        ];

        store.dispatch(moviesQueueActions.loadMoviesQueue())
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
          store.dispatch(moviesQueueActions.loadInitialMoviesQueue())
            .then(() => {
              should(store.getActions()).deepEqual([
                { type: types.LOADING_MOVIES },
                {
                  type: types.MOVIES_QUEUE_LOADED,
                  moviesQueue: [
                    { id: 'x' },
                    { id: 'y' },
                    { id: 'c' },
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
        fetchMock.mock(LOAD_MOVIES_QUEUE_API, 401);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(moviesQueueActions.loadMoviesQueue())
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
        store.dispatch(moviesQueueActions.loadMoviesQueue())
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
