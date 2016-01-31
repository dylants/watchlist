import rewire from 'rewire';
import should from 'should';

describe('The logger library', () => {
  let logger;

  beforeEach(() => {
    logger = rewire('../../../server/lib/logger');
  });

  it('should exist', () => {
    should.exist(logger);
  });

  it('should return a log and error function for logger', () => {
    const myLogger = logger();

    should.exist(myLogger.log);
    should.exist(myLogger.error);
  });
});
