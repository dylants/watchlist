import rewire from 'rewire';

describe('The slugify library', () => {
  let slugify;

  beforeEach(() => {
    slugify = rewire('../../../server/lib/slugify');
  });

  it('should exist', () => {
    expect(slugify).toBeDefined();
  });

  it('should work for a normal string', () => {
    expect(slugify("hey how's it going")).toEqual('hey-hows-it-going');
  });

  it('should lowercase', () => {
    expect(slugify('YES')).toEqual('yes');
  });

  it('should work with a really long string', () => {
    const string = 'this is something that is really long and should not be kept' +
      'as one string because it\'s too long. Yes, really really long!';
    expect(string.length > 60).toBeTruthy();
    expect(slugify(string).length).toEqual(60);
  });
});
