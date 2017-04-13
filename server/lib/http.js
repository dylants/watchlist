import util from 'util';

const logger = require('./logger')();

export function convertQueryStringToNumber(string) {
  const number = parseInt(string, 10);

  // convert to undefined if it's not a valid number
  if (isNaN(number)) {
    return undefined;
  }

  return number;
}

/*
 * Meant to handle a generic error in an HTTP request, returning the
 * error in a response to the user.
 */
export function handleError(err, functionName, res) {
  logger.error('handleError: Error in %s', functionName, err);

  return res.status(500).send({
    error: typeof err === 'object' ? util.inspect(err) : err,
  });
}
