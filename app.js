const path = require('path');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');

const publicPath = path.resolve(__dirname, './client/dist');

const env = process.env.NODE_ENV;
if (env === 'testing' || env === 'development') {
  dotenv.load();
}

const app = express();

// Configure webpack hot reloading
if (env === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}


// Connect to the db.
require('./server/config/db');

// Log all requests to the console when not testing.
if (env !== 'testing') {
  app.use(logger('dev'));
}

// Grab post data from the request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));

// Routes
require('./server/routes')(app);
app.get('*', (req, res) => res.sendFile(path.join(publicPath, '/index.html')));

// If we get here, we must have matched nothing... Or we're dying.
// Shake it off. ¯\_(ツ)_/¯

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found.');
  err.status = 404;
  next(err);
});

// development error handler
if (env === 'development' || env === 'testing') {
  app.use((err, req, res) => res.status(err.status || 500)
    .send({
      message: err.message,
      error: err
    }));
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => res.status(err.status || 500)
  .send({
    message: err.message,
    error: {}
  }));

module.exports = app;
