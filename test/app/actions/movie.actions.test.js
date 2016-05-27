import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as movieActions from '../../../app/actions/movie.actions';
import * as types from '../../../app/constants/action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movieActions', () => {
  let store;
  let UPDATED_MOVIE;

  beforeEach(() => {
    store = mockStore({
      moviesState: {
        moviesQueue: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
        savedMovies: [{ id: 'd' }, { id: 'e' }, { id: 'f' }],
        dismissedMovies: [{ id: 'g' }, { id: 'h' }, { id: 'i' }],
      },
    });

    UPDATED_MOVIE = {
      a: 1,
      b: 2,
    };
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
        fetchMock.mock(SAVE_MOVIE_API, {
          body: UPDATED_MOVIE,
          status: 200,
        });
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.SAVING_MOVIE },
          { type: types.SAVED_MOVIE, updatedMovie: UPDATED_MOVIE },
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
        fetchMock.mock(DISMISS_MOVIE_API, {
          body: UPDATED_MOVIE,
          status: 200,
        });
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.DISMISSING_MOVIE },
          { type: types.DISMISSED_MOVIE, updatedMovie: UPDATED_MOVIE },
        ];

        store.dispatch(movieActions.dismissMovie('a'))
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
    const UNDISMISS_MOVIE_API = '/api/secure/movies/a';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(UNDISMISS_MOVIE_API, {
          body: UPDATED_MOVIE,
          status: 200,
        });
      });

      it('should return the correct actions', (done) => {
        const expectedActions = [
          { type: types.UNDISMISSING_MOVIE },
          { type: types.UNDISMISSED_MOVIE, updatedMovie: UPDATED_MOVIE },
        ];

        store.dispatch(movieActions.undismissMovie('a'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock(UNDISMISS_MOVIE_API, 500);
      });

      it('should return the correct actions', (done) => {
        store.dispatch(movieActions.undismissMovie('a'))
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
