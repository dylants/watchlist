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
  },
};

export default config;
