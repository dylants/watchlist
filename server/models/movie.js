import mongoose from 'mongoose';
import slugify from '../lib/slugify';
import createdModifiedPlugin from './plugins/created-modified';

const logger = require('../lib/logger')();
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  // the ID is the slugify'ed version of the movie title
  _id: String,

  // various movie metadata...
  title: String,
  userScore: Number,
  criticScore: Number,
  tomatoIcon: String,
  mpaaRating: String,
  runtime: String,
  theaterReleaseDate: String,
  synopsis: String,
  images: Array,
  url: String,

  // user interactions
  saved: Boolean,
  dismissed: Boolean,
});

// include created and modified dates
MovieSchema.plugin(createdModifiedPlugin);

// generate an ID for the movie
function generateId(movie) {
  // the ID is generated from slugify'ing the movie title
  return slugify(movie.title);
}

MovieSchema.statics.generateId = generateId;

// pre-save hook for storing the title as the id
MovieSchema.pre('save', function storeTitleAsId(next) {
  const movie = this;

  if (movie.isNew) {
    logger.log('pre-save hook for storing title as id');

    movie._id = generateId(movie);
    logger.log('pre-save hook for storing title as id produces: %s', movie._id);

    logger.log('pre-save hook for storing title as id complete');
  } else {
    logger.log('pre-save hook for storing title as id skipped, document is not new');
  }

  return next();
});

mongoose.model('Movie', MovieSchema);
