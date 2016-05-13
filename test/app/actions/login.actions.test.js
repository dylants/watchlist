import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as loginActions from '../../../app/actions/login.actions';
import * as types from '../../../app/action-types/login.action-types';
import should from 'should';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('loginActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should exist', () => {
    should.exist(loginActions);
  });

  describe('login', () => {
    const LOGIN_API = '/api/session';

    describe('with no username/password', () => {
      let expectedActions;

      beforeEach(() => {
        expectedActions = [
          { type: types.LOGIN_INITIATED, payload: undefined },
          { type: types.LOGIN_ERROR, error: 'Please enter a username and password.' },
        ];
      });

      it('should return login error with no username', (done) => {
        store.dispatch(loginActions.login(null, 'pw'));
        should(store.getActions()).deepEqual(expectedActions);
        done();
      });

      it('should return login error with no password', (done) => {
        store.dispatch(loginActions.login('user', null));
        should(store.getActions()).deepEqual(expectedActions);
        done();
      });
    });

    describe('with invalid username/password', () => {
      beforeEach(() => {
        fetchMock.mock(LOGIN_API, {
          body: {},
          status: 401,
        });
      });

      it('should return login error', (done) => {
        const expectedActions = [
          { type: types.LOGIN_INITIATED, payload: undefined },
          { type: types.LOGIN_ERROR, error: 'Incorrect username or password.' },
        ];

        store.dispatch(loginActions.login('u', 'p'))
          .then(() => {
            should(store.getActions()).deepEqual(expectedActions);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });

    describe('with valid username/password', () => {
      let username;

      beforeEach(() => {
        username = 'biff';

        fetchMock.mock(LOGIN_API, {
          body: { username },
          status: 201,
        });
      });

      it('should return correct actions', (done) => {
        store.dispatch(loginActions.login('u', 'p'))
          .then(() => {
            const actions = store.getActions();

            should(actions.length).equal(3);
            should(actions[0]).deepEqual({ type: types.LOGIN_INITIATED, payload: undefined });
            should(actions[1]).deepEqual({ type: types.LOGIN_SUCCESS, user: { username } });
            should(actions[2].payload.args).deepEqual(['/']);
          })
          .then(done)   // testing complete
          .catch(done); // we do this in case the tests fail, to end tests
      });
    });
  });
});
