import testHelper from '../test-helper';
import mongoose from 'mongoose';
import should from 'should';

describe('The Movie schema', () => {
  let Movie;

  before(() => {
    require('../../../server/models/movie');
  });

  after(() => {
    // clear models after tests complete
    testHelper.clearMongooseModels();
  });

  beforeEach(() => {
    Movie = mongoose.model('Movie');
  });

  it('should exist', () => {
    should.exist(Movie);
  });

  describe('generateId', () => {
    it('should work', () => {
      (Movie.generateId(
        {
          title: 'This is a name!',
          a: 1,
          b: 2,
        }
      )).should.equal('this-is-a-name');
    });
  });
});
