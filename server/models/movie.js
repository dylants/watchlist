import mongoose from 'mongoose';
import createdModifiedPlugin from './plugins/created-modified';

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: String,
  userScore: String,
  criticScore: String,
  mpaaRating: String,
  runtime: String,
  synopsis: String,
});

// include created and modified dates
MovieSchema.plugin(createdModifiedPlugin);

mongoose.model('Movie', MovieSchema);
