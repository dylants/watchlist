import should from 'should';

describe('The slugify library', () => {
  let slugify;

  beforeEach(() => {
    slugify = require('../../../server/lib/slugify');
  });

  it('should exist', () => {
    should.exist(slugify);
  });

  it('should work for a normal string', () => {
    slugify("hey how's it going").should.equal('hey-hows-it-going');
  });

  it('should lowercase', () => {
    slugify('YES').should.equal('yes');
  });

  it('should work with a really long string', () => {
    const string = 'this is something that is really long and should not be kept' +
      'as one string because it\'s too long. Yes, really really long!';
    (string.length).should.be.above(60);
    (slugify(string).length).should.equal(60);
  });
});
