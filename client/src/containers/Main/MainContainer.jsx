if (process.env.NODE_ENV === 'production') {
  /* eslint-disable global-require */
  module.exports = require('./MainContainer.prod');
} else {
  module.exports = require('./MainContainer.dev');
  /* eslint-enable global-require */
}
