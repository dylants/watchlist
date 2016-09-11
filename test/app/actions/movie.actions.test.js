import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import should from 'should';

import * as movieActions from '../../../app/actions/movie.actions';
import * as types from '../../../app/constants/action-types';
import * as movieTypes from '../../../app/constants/movie-types';

const fetchMock = require('fetch-mock');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('movie actions', () => {
  let store;
  let UPDATED_MOVIE;

  beforeEach(() => {
    store = mockStore({
      movieGroupsState: {
        moviesQueue: {
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
        savedMovies: {
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
        dismissedMovies: {
          skip: 0,
          limit: 20,
          movies: [],
          hasMoreMovies: true,
        },
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

  describe('movies queue actions', () => {
    describe('when no movies exist in state', () => {
      const MOVIES_QUEUE_URI = '/api/secure/movies?saved=false&skip=0&limit=20';
      const MOVIES = [{ a: 1 }, { b: 2 }];

      describe('when movies are returned', () => {
        beforeEach(() => {
          fetchMock.mock(MOVIES_QUEUE_URI, {
            body: MOVIES,
            status: 200,
          });
        });

        describe('loadMoviesQueue', () => {
          it('should dispatch the correct actions', (done) => {
            const expectedActions = [
              {
                type: types.LOADING_MOVIES,
                movieType: movieTypes.MOVIES_QUEUE,
              },
              {
                type: types.MOVIES_LOADED,
                movieType: movieTypes.MOVIES_QUEUE,
                movies: MOVIES,
              },
            ];

            store.dispatch(movieActions.loadMoviesQueue())
              .then(() => {
                should(store.getActions()).deepEqual(expectedActions);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialMoviesQueue', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialMoviesQueue())
              .then(() => {
                should(store.getActions()).deepEqual([
                  {
                    type: types.LOADING_MOVIES,
                    movieType: movieTypes.MOVIES_QUEUE,
                  },
                  {
                    type: types.MOVIES_LOADED,
                    movieType: movieTypes.MOVIES_QUEUE,
                    movies: MOVIES,
                  },
                ]);
              })
              .then(done)
              .catch(done);
          });
        });
      });

      describe('when the API call fails (500)', () => {
        beforeEach(() => {
          fetchMock.mock(MOVIES_QUEUE_URI, 500);
        });

        describe('loadMoviesQueue', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadMoviesQueue())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.MOVIES_QUEUE,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.MOVIES_QUEUE);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialMoviesQueue', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialMoviesQueue())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.MOVIES_QUEUE,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.MOVIES_QUEUE);
              })
              .then(done)
              .catch(done);
          });
        });
      });
    });

    describe('when movies exist in state', () => {
      beforeEach(() => {
        store = mockStore({
          movieGroupsState: {
            moviesQueue: {
              skip: 0,
              limit: 20,
              movies: [{ a: 1 }],
              hasMoreMovies: true,
            },
            savedMovies: {},
            dismissedMovies: {},
          },
        });
      });

      describe('loadInitialMoviesQueue', () => {
        it('should dispatch the correct actions', () => {
          store.dispatch(movieActions.loadInitialMoviesQueue());
          should(store.getActions()).deepEqual([
            {
              type: types.MOVIES_ALREADY_LOADED,
              movieType: movieTypes.MOVIES_QUEUE,
            },
          ]);
        });
      });
    });
  });

  describe('saved movies actions', () => {
    describe('when no movies exist in state', () => {
      const SAVED_MOVIES_URI = '/api/secure/movies?saved=true&skip=0&limit=20';
      const MOVIES = [{ a: 1 }, { b: 2 }];

      describe('when movies are returned', () => {
        beforeEach(() => {
          fetchMock.mock(SAVED_MOVIES_URI, {
            body: MOVIES,
            status: 200,
          });
        });

        describe('loadSavedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            const expectedActions = [
              {
                type: types.LOADING_MOVIES,
                movieType: movieTypes.SAVED_MOVIES,
              },
              {
                type: types.MOVIES_LOADED,
                movieType: movieTypes.SAVED_MOVIES,
                movies: MOVIES,
              },
            ];

            store.dispatch(movieActions.loadSavedMovies())
              .then(() => {
                should(store.getActions()).deepEqual(expectedActions);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialSavedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialSavedMovies())
              .then(() => {
                should(store.getActions()).deepEqual([
                  {
                    type: types.LOADING_MOVIES,
                    movieType: movieTypes.SAVED_MOVIES,
                  },
                  {
                    type: types.MOVIES_LOADED,
                    movieType: movieTypes.SAVED_MOVIES,
                    movies: MOVIES,
                  },
                ]);
              })
              .then(done)
              .catch(done);
          });
        });
      });

      describe('when the API call fails (500)', () => {
        beforeEach(() => {
          fetchMock.mock(SAVED_MOVIES_URI, 500);
        });

        describe('loadSavedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadSavedMovies())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.SAVED_MOVIES,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.SAVED_MOVIES);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialSavedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialSavedMovies())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.SAVED_MOVIES,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.SAVED_MOVIES);
              })
              .then(done)
              .catch(done);
          });
        });
      });
    });

    describe('when movies exist in state', () => {
      beforeEach(() => {
        store = mockStore({
          movieGroupsState: {
            moviesQueue: {},
            savedMovies: {
              skip: 0,
              limit: 20,
              movies: [{ a: 1 }],
              hasMoreMovies: true,
            },
            dismissedMovies: {},
          },
        });
      });

      describe('loadInitialSavedMovies', () => {
        it('should dispatch the correct actions', () => {
          store.dispatch(movieActions.loadInitialSavedMovies());
          should(store.getActions()).deepEqual([
            {
              type: types.MOVIES_ALREADY_LOADED,
              movieType: movieTypes.SAVED_MOVIES,
            },
          ]);
        });
      });
    });
  });

  describe('dismissed movies actions', () => {
    describe('when no movies exist in state', () => {
      const DISMISSED_MOVIES_URI = '/api/secure/movies?dismissed=true&skip=0&limit=20';
      const MOVIES = [{ a: 1 }, { b: 2 }];

      describe('when movies are returned', () => {
        beforeEach(() => {
          fetchMock.mock(DISMISSED_MOVIES_URI, {
            body: MOVIES,
            status: 200,
          });
        });

        describe('loadDismissedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            const expectedActions = [
              {
                type: types.LOADING_MOVIES,
                movieType: movieTypes.DISMISSED_MOVIES,
              },
              {
                type: types.MOVIES_LOADED,
                movieType: movieTypes.DISMISSED_MOVIES,
                movies: MOVIES,
              },
            ];

            store.dispatch(movieActions.loadDismissedMovies())
              .then(() => {
                should(store.getActions()).deepEqual(expectedActions);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialDismissedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialDismissedMovies())
              .then(() => {
                should(store.getActions()).deepEqual([
                  {
                    type: types.LOADING_MOVIES,
                    movieType: movieTypes.DISMISSED_MOVIES,
                  },
                  {
                    type: types.MOVIES_LOADED,
                    movieType: movieTypes.DISMISSED_MOVIES,
                    movies: MOVIES,
                  },
                ]);
              })
              .then(done)
              .catch(done);
          });
        });
      });

      describe('when the API call fails (500)', () => {
        beforeEach(() => {
          fetchMock.mock(DISMISSED_MOVIES_URI, 500);
        });

        describe('loadDismissedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadDismissedMovies())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.DISMISSED_MOVIES,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.DISMISSED_MOVIES);
              })
              .then(done)
              .catch(done);
          });
        });

        describe('loadInitialDismissedMovies', () => {
          it('should dispatch the correct actions', (done) => {
            store.dispatch(movieActions.loadInitialDismissedMovies())
              .then(() => {
                const actions = store.getActions();

                should(actions.length).equal(2);
                should(actions[0]).deepEqual({
                  type: types.LOADING_MOVIES,
                  movieType: movieTypes.DISMISSED_MOVIES,
                });
                should(actions[1].type).equal(types.FAILED_LOADING_MOVIES);
                should(actions[1].movieType).equal(movieTypes.DISMISSED_MOVIES);
              })
              .then(done)
              .catch(done);
          });
        });
      });
    });

    describe('when movies exist in state', () => {
      beforeEach(() => {
        store = mockStore({
          movieGroupsState: {
            moviesQueue: {},
            savedMovies: {},
            dismissedMovies: {
              skip: 0,
              limit: 20,
              movies: [{ a: 1 }],
              hasMoreMovies: true,
            },
          },
        });
      });

      describe('loadInitialDismissedMovies', () => {
        it('should dispatch the correct actions', () => {
          store.dispatch(movieActions.loadInitialDismissedMovies());
          should(store.getActions()).deepEqual([
            {
              type: types.MOVIES_ALREADY_LOADED,
              movieType: movieTypes.DISMISSED_MOVIES,
            },
          ]);
        });
      });
    });
  });

  describe('updating a movie', () => {
    const UPDATE_MOVIE_API = '/api/secure/movies/a';

    describe('when the API call is successful', () => {
      beforeEach(() => {
        fetchMock.mock(UPDATE_MOVIE_API, {
          body: UPDATED_MOVIE,
          status: 200,
        });
      });

      describe('saveMovie', () => {
        it('should return the correct actions', (done) => {
          const expectedActions = [
            {
              type: types.UPDATING_MOVIE,
              movieType: movieTypes.SAVED_MOVIES,
            },
            {
              type: types.SAVED_MOVIE,
              updatedMovie: UPDATED_MOVIE,
            },
          ];

          store.dispatch(movieActions.saveMovie('a'))
            .then(() => {
              should(store.getActions()).deepEqual(expectedActions);
            })
            .then(done)
            .catch(done);
        });
      });

      describe('dismissedMovie', () => {
        it('should return the correct actions', (done) => {
          const expectedActions = [
            {
              type: types.UPDATING_MOVIE,
              movieType: movieTypes.MOVIES_QUEUE,
            },
            {
              type: types.DISMISSED_MOVIE,
              updatedMovie: UPDATED_MOVIE,
            },
          ];

          store.dispatch(movieActions.dismissMovie('a'))
            .then(() => {
              should(store.getActions()).deepEqual(expectedActions);
            })
            .then(done)
            .catch(done);
        });
      });

      describe('undismissMovie', () => {
        it('should return the correct actions', (done) => {
          const expectedActions = [
            {
              type: types.UPDATING_MOVIE,
              movieType: movieTypes.DISMISSED_MOVIES,
            },
            {
              type: types.UNDISMISSED_MOVIE,
              updatedMovie: UPDATED_MOVIE,
            },
          ];

          store.dispatch(movieActions.undismissMovie('a'))
            .then(() => {
              should(store.getActions()).deepEqual(expectedActions);
            })
            .then(done)
            .catch(done);
        });
      });
    });

    describe('when the API call fails (500)', () => {
      beforeEach(() => {
        fetchMock.mock(UPDATE_MOVIE_API, 500);
      });

      describe('saveMovie', () => {
        it('should return the correct actions', (done) => {
          store.dispatch(movieActions.saveMovie('a'))
            .then(() => {
              const actions = store.getActions();

              should(actions.length).equal(2);
              should(actions[0]).deepEqual({
                type: types.UPDATING_MOVIE,
                movieType: movieTypes.SAVED_MOVIES,
              });
              should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
              should(actions[1].movieType).equal(movieTypes.SAVED_MOVIES);
            })
            .then(done)
            .catch(done);
        });
      });

      describe('dismissMovie', () => {
        it('should return the correct actions', (done) => {
          store.dispatch(movieActions.dismissMovie('a'))
            .then(() => {
              const actions = store.getActions();

              should(actions.length).equal(2);
              should(actions[0]).deepEqual({
                type: types.UPDATING_MOVIE,
                movieType: movieTypes.MOVIES_QUEUE,
              });
              should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
              should(actions[1].movieType).equal(movieTypes.MOVIES_QUEUE);
            })
            .then(done)
            .catch(done);
        });
      });

      describe('undismissMovie', () => {
        it('should return the correct actions', (done) => {
          store.dispatch(movieActions.undismissMovie('a'))
            .then(() => {
              const actions = store.getActions();

              should(actions.length).equal(2);
              should(actions[0]).deepEqual({
                type: types.UPDATING_MOVIE,
                movieType: movieTypes.DISMISSED_MOVIES,
              });
              should(actions[1].type).equal(types.FAILED_UPDATING_MOVIE);
              should(actions[1].movieType).equal(movieTypes.DISMISSED_MOVIES);
            })
            .then(done)
            .catch(done);
        });
      });
    });
  });
});
