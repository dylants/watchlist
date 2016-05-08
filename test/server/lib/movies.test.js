import rewire from 'rewire';
import should from 'should';
import _ from 'lodash';

import testHelper from '../test-helper';
import config from '../../../server/config';

describe('The movies library', () => {
  let moviesLib;

  before(() => {
    // create fake mongoose models
    testHelper.loadMongooseModels();
  });

  after(() => {
    // clear 'fake' models after tests complete
    testHelper.clearMongooseModels();
  });

  beforeEach(() => {
    moviesLib = rewire('../../../server/lib/movies');
  });

  it('should exist', () => {
    should.exist(moviesLib);
  });

  describe('parseMovies', () => {
    let MOVIES;
    let parseMovies;

    beforeEach(() => {
      MOVIES = [
        {
          popcornScore: 59,
          tomatoScore: 13,
          mpaaRating: 'PG-13',
          runtime: '1 hr. 42 min.',
          synopsisType: 'consensus',
          url: '/m/ride_along_2/',
          id: 771376964,
          tomatoIcon: 'rotten',
          title: 'Ride Along 2',
          theaterReleaseDate: 'Jan 15',
          synopsis: 'Ride Along 2 presents a cop-comedy sequel whose well-matched stars...',
          dvdReleaseDate: '',
          actors: [
            'Ice Cube',
            'Kevin Hart',
            'Tika Sumpter',
          ],
          posters: {
            primary: 'http://image1.com',
            secondary: 'http://image2.com',
          },
        },
        {
          popcornScore: 86,
          tomatoScore: 82,
          mpaaRating: 'R',
          runtime: '2 hr. 36 min.',
          synopsisType: 'consensus',
          url: '/m/the_revenant_2015/',
          id: 771379020,
          tomatoIcon: 'certified',
          title: 'The Revenant',
          theaterReleaseDate: 'Dec 25',
          synopsis: 'As starkly beautiful as it is harshly uncompromising, The Revenant uses...',
          dvdReleaseDate: '',
          actors: [
            'Leonardo DiCaprio',
            'Tom Hardy',
            'Domhnall Gleeson',
          ],
          posters: {
            primary: 'http://image1.jpg',
            secondary: 'http://image2.jpg',
          },
        },
      ];
      parseMovies = moviesLib.__get__('parseMovies');
    });

    it('should correctly parse movies', (done) => {
      parseMovies(MOVIES, (err, movies) => {
        should(err).be.null();
        movies.should.deepEqual([
          {
            title: 'Ride Along 2',
            userScore: 59,
            criticScore: 13,
            tomatoIcon: 'rotten',
            mpaaRating: 'PG-13',
            runtime: '1 hr. 42 min.',
            theaterReleaseDate: 'Jan 15',
            synopsis: 'Ride Along 2 presents a cop-comedy sequel whose well-matched stars...',
            images: [
              'http://image1.com',
              'http://image2.com',
            ],
            url: `${config.movies.domain}/m/ride_along_2/`,
          },
          {
            title: 'The Revenant',
            userScore: 86,
            criticScore: 82,
            tomatoIcon: 'certified',
            mpaaRating: 'R',
            runtime: '2 hr. 36 min.',
            theaterReleaseDate: 'Dec 25',
            synopsis: 'As starkly beautiful as it is harshly uncompromising, The Revenant uses...',
            images: [
              'http://image1.jpg',
              'http://image2.jpg',
            ],
            url: `${config.movies.domain}/m/the_revenant_2015/`,
          },
        ]);

        done();
      });
    });
  });

  describe('filterMovies', () => {
    let MOVIES;
    let filterMovies;

    beforeEach(() => {
      MOVIES = [

        // user score
        {
          title: 'A',
          userScore: 86,
          criticScore: 12,
        },

        // critic score
        {
          title: 'B',
          userScore: 12,
          criticScore: 86,
        },

        // user and critic score
        {
          title: 'C',
          userScore: 64,
          criticScore: 65,
        },

        // filtered out of list
        {
          title: 'D',
          userScore: 12,
          criticScore: 12,
        },
      ];

      filterMovies = moviesLib.__get__('filterMovies');
    });

    it('should filter movies', (done) => {
      filterMovies(MOVIES, (err, movies) => {
        should(err).be.null();
        movies.should.deepEqual([
          {
            title: 'A',
            userScore: 86,
            criticScore: 12,
          },
          {
            title: 'B',
            userScore: 12,
            criticScore: 86,
          },
          {
            title: 'C',
            userScore: 64,
            criticScore: 65,
          },
        ]);

        done();
      });
    });
  });

  describe('saveMovie', () => {
    let Movie;
    let saveMovie;
    let _id;
    let _update;
    let _options;

    beforeEach(() => {
      Movie = () => {};

      Movie.generateId = (movie) => {
        if (movie.title === 'update movie') {
          return 'update-movie';
        } else {
          return 'save-movie';
        }
      };

      Movie.findById = (id, callback) => {
        if (id === 'update-movie') {
          return callback(null, {});
        } else {
          return callback();
        }
      };

      Movie.findByIdAndUpdate = function findByIdAndUpdate(id, update, options, callback) {
        _id = id;
        _update = update;
        _options = options;
        return callback(null, {
          x: 1,
        });
      };

      Movie.prototype.save = (callback) => {
        callback(null, {
          y: 2,
        });
      };

      moviesLib.__set__('Movie', Movie);
      saveMovie = moviesLib.__get__('saveMovie');
    });

    it('should corretly pass the movieMetadata on update', (done) => {
      saveMovie({
        title: 'update movie',
        a: 1,
        b: undefined,
        c: null,
        d: 'hey',
      }, (err, stats) => {
        should(err).be.null();
        (_id).should.equal('update-movie');
        (_update).should.deepEqual({
          title: 'update movie',
          a: 1,
          d: 'hey',
        });
        (_options).should.deepEqual({
          new: true,
        });
        (stats).should.deepEqual({
          movie: { x: 1 },
          isNew: false,
        });

        done();
      });
    });

    it('should corretly pass the movieMetadata on create', (done) => {
      saveMovie({
        title: 'save movie',
        a: 2,
        b: null,
        c: undefined,
        d: 'ho',
      }, (err, stats) => {
        should(err).be.null();
        (stats).should.deepEqual({
          movie: { y: 2 },
          isNew: true,
        });

        done();
      });
    });
  });

  describe('saveMovies', () => {
    let saveMovies;
    let MOVIES;

    beforeEach(() => {
      MOVIES = [
        {
          title: 'new movie 1',
        },
        {
          title: 'old movie 1',
        },
        {
          title: 'old movie 2',
        },
      ];

      moviesLib.__set__('saveMovie', (movie, callback) => {
        if (_.includes(movie.title, 'new')) {
          return callback(null, {
            isNew: true,
          });
        } else {
          return callback(null, {
            isNew: false,
          });
        }
      });

      saveMovies = moviesLib.__get__('saveMovies');
    });

    it('should correctly return the stats', (done) => {
      saveMovies(MOVIES, (err, stats) => {
        should(err).be.null();
        (stats).should.deepEqual({
          totalMovies: 3,
          moviesAdded: 1,
          moviesUpdated: 2,
        });

        done();
      });
    });
  });

  describe('buildMovieUI', () => {
    let buildMovieUI;

    beforeEach(() => {
      buildMovieUI = moviesLib.__get__('buildMovieUI');
    });

    it('should return correct data for normally populated movie', () => {
      (buildMovieUI({
        _id: 'my-movie',
        title: 'My Movie',
        userScore: 100,
        criticScore: 80,
        tomatoIcon: 'certified',
        mpaaRating: 'G',
        runtime: '1 hour',
        synopsis: 'Good things',
        images: [
          'one.jpg',
          'two.jpg',
        ],
        saved: true,
        dismissed: false,
      })).should.deepEqual({
        id: 'my-movie',
        title: 'My Movie',
        userScore: 100,
        criticScore: 80,
        tomatoIcon: 'certified',
        mpaaRating: 'G',
        runtime: '1 hour',
        synopsis: 'Good things',
        image: 'one.jpg',
        saved: true,
        dismissed: false,
      });
    });

    it('should return correct data for partially filled movie', () => {
      (buildMovieUI({
        _id: 'my-movie',
        title: 'My Movie',
        userScore: 100,
        criticScore: 80,
        tomatoIcon: 'fresh',
        mpaaRating: 'G',
        runtime: '1 hour',
        synopsis: 'Good things',
      })).should.deepEqual({
        id: 'my-movie',
        title: 'My Movie',
        userScore: 100,
        criticScore: 80,
        tomatoIcon: 'fresh',
        mpaaRating: 'G',
        runtime: '1 hour',
        synopsis: 'Good things',
        image: null,
        saved: false,
        dismissed: false,
      });
    });
  });

  describe('loadMovies', () => {
    let MOVIES;
    let Movie;

    beforeEach(() => {
      MOVIES = [{ a: 1 }, { b: 2 }];

      Movie = {
        _conditions: null,
        _options: null,
        find(conditions, projection, options, callback) {
          this._conditions = conditions;
          this._options = options;
          return callback(null, MOVIES);
        },
      };

      moviesLib.__set__('Movie', Movie);

      moviesLib.__set__('buildMovieUI', (movie) => movie);
    });

    it('should work with defaults', () => {
      moviesLib.loadMovies({}, {}, (err, moviesUI) => {
        should(err).be.null();
        should(moviesUI).deepEqual(MOVIES);

        should(Movie._conditions).deepEqual({
          dismissed: false,
        });
        should(Movie._options).deepEqual({
          skip: 0,
          limit: 20,
        });
      });
    });

    it('should allow for overrides of conditions/options', () => {
      moviesLib.loadMovies({
        dismissed: true,
      }, {
        skip: 12,
        limit: 2,
      }, (err, moviesUI) => {
        should(err).be.null();
        should(moviesUI).deepEqual(MOVIES);

        should(Movie._conditions).deepEqual({
          dismissed: true,
        });
        should(Movie._options).deepEqual({
          skip: 12,
          limit: 2,
        });
      });
    });
  });

  describe('update movie', () => {
    let Movie;

    beforeEach(() => {
      Movie = {
        _id: null,
        _updates: null,
        _options: null,
        findByIdAndUpdate(id, updates, options, callback) {
          this._id = id;
          this._updates = updates;
          this._options = options;
          return callback();
        },
      };

      moviesLib.__set__('Movie', Movie);
    });

    describe('enableSaved', () => {
      it('should work', () => {
        moviesLib.enableSaved('123', () => {
          should(Movie._id).equal('123');
          should(Movie._updates).deepEqual({
            saved: true,
          });
          should(Movie._options).deepEqual({
            new: true,
          });
        });
      });
    });

    describe('enableDismissed', () => {
      it('should work', () => {
        moviesLib.enableDismissed('123', () => {
          should(Movie._id).equal('123');
          should(Movie._updates).deepEqual({
            dismissed: true,
          });
          should(Movie._options).deepEqual({
            new: true,
          });
        });
      });
    });

    describe('disableDismissed', () => {
      it('should work', () => {
        moviesLib.disableDismissed('123', () => {
          should(Movie._id).equal('123');
          should(Movie._updates).deepEqual({
            dismissed: false,
          });
          should(Movie._options).deepEqual({
            new: true,
          });
        });
      });
    });
  });
});
