import mongoose from 'mongoose';
import slugify from '../lib/slugify';
import createdModifiedPlugin from './plugins/created-modified';

const logger = require('../lib/logger')();
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  _id: String,
  title: String,
  userScore: Number,
  criticScore: Number,
  mpaaRating: String,
  runtime: String,
  theaterReleaseDate: String,
  synopsis: String,
  images: Array,
});

// include created and modified dates
MovieSchema.plugin(createdModifiedPlugin);

// pre-save hook for storing the title as the id
MovieSchema.pre('save', function storeTitleAsId(next) {
  const movie = this;

  if (movie.isNew) {
    logger.log('pre-save hook for storing title as id');

    movie._id = slugify(movie.title);
    logger.log('pre-save hook for storing title as id produces: %s', movie._id);

    logger.log('pre-save hook for storing title as id complete');
  } else {
    logger.log('pre-save hook for storing title as id skipped, document is not new');
  }

  return next();
});

mongoose.model('Movie', MovieSchema);
