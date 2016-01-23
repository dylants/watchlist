const config = {
  port: process.env.PORT || 3000,
  mongo: {
    protocol: process.env.MONGO_PROTOCOL || 'mongodb://',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DB || 'watchlist',
  },
  movies: {
    domain: process.env.MOVIES_DOMAIN || 'https://www.rottentomatoes.com',
    api: process.env.MOVIES_API || '/api/private/v1.0/m/list/find',
    limit: process.env.MOVIES_LIMIT || 100,
    type: process.env.MOVIES_TYPE || 'in-theaters',
    sortBy: process.env.MOVIES_SORT_BY || 'popularity',
  },
  movieFilter: {
    topMoviesIndex: process.env.TOP_MOVIES_INDEX || 0,
    minUserScore: process.env.MIN_USER_SCORE || 70,
    minCriticScore: process.env.MIN_CRITIC_SCORE || 80,
    minUserCriticScore: process.env.MIN_USER_CRITIC_SCORE || 60,
  },
};

export default config;
