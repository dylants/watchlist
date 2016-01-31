import rewire from 'rewire';
import testHelper from '../test-helper';
import should from 'should';

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
            mpaaRating: 'PG-13',
            runtime: '1 hr. 42 min.',
            theaterReleaseDate: 'Jan 15',
            synopsis: 'Ride Along 2 presents a cop-comedy sequel whose well-matched stars...',
            images: [
              'http://image1.com',
              'http://image2.com',
            ],
          },
          {
            title: 'The Revenant',
            userScore: 86,
            criticScore: 82,
            mpaaRating: 'R',
            runtime: '2 hr. 36 min.',
            theaterReleaseDate: 'Dec 25',
            synopsis: 'As starkly beautiful as it is harshly uncompromising, The Revenant uses...',
            images: [
              'http://image1.jpg',
              'http://image2.jpg',
            ],
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

    beforeEach(() => {
      Movie = {
        findByIdAndUpdate(id, update, options, callback) {
          this._id = id;
          this._update = update;
          this._options = options;
          return callback();
        },
      };
      moviesLib.__set__('Movie', Movie);
      saveMovie = moviesLib.__get__('saveMovie');
    });

    it('should corretly pass the movieMetadata', () => {
      saveMovie({
        title: 'The movie title',
        a: 1,
        b: undefined,
        c: null,
        d: 'hey',
      }, () => {});
      (Movie._id.should).equal('the-movie-title');
      (Movie._update).should.deepEqual({
        title: 'The movie title',
        a: 1,
        d: 'hey',
      });
      (Movie._options).should.deepEqual({
        upsert: true,
        new: true,
      });
    });
  });
});
