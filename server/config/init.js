/* eslint no-console:0 */

export default function () {
  if (process.env.NODE_ENV) {
    console.log(`Application loaded using the ${process.env.NODE_ENV} environment`);
  } else {
    console.error('NODE_ENV is not defined! Using default development environment');
    process.env.NODE_ENV = 'development';
  }
}
