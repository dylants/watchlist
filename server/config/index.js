const config = {
  port: process.env.PORT || 3000,
  movies: {
    domain: process.env.MOVIES_DOMAIN || 'https://www.rottentomatoes.com',
    api: process.env.MOVIES_API || '/api/private/v1.0/m/list/find',
  },
};

export default config;
