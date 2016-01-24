import mongoose from 'mongoose';

const testHelper = {};
module.exports = testHelper;

/**
 * This function is useful for tests that require Mongoose models
 * loaded prior to loading the test file. This should be called in
 * the tests `beforeEach` prior to loading the file to test. The
 * `clearMongooseModels` function should be called in the `afterEach`.
 */
testHelper.loadMongooseModels = () => {
  try {
    mongoose.model('Movie');
  } catch (err) {
    mongoose.model('Movie', {});
  }
};

/**
 * This mirrors the above `loadMongooseModels` to clean up what
 * was done, and should be called in the `afterEach` of tests.
 */
testHelper.clearMongooseModels = () => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
};
