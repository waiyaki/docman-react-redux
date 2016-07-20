
if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require */
  module.exports = require('./configureStore.dev');
} else {
  module.exports = require('./configureStore.prod');
  /* eslint-enable global-require */
}
