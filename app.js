(function () {
  'use strict';

  var path = require('path');
  var express = require('express');
  var logger = require('morgan');
  var bodyParser = require('body-parser');
  var dotenv = require('dotenv');

  var publicPath = path.resolve(__dirname, './client/dist');

  var env = process.env.NODE_ENV;
  if (env === 'testing' || env === 'development') {
    dotenv.load();
  }
  var app = express();

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
  app.get('*', function (req, res) {
    return res.sendFile(path.join(publicPath, '/index.html'));
  });

  // If we get here, we must have matched nothing... Or we're dying.
  // Shake it off. ¯\_(ツ)_/¯

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
  });

  // development error handler
  if (env === 'development' || env === 'testing') {
    app.use(function (err, req, res, next) {
      return res.status(err.status || 500).send({
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    return res.status(err.status || 500).send({
      message: err.message,
      error: {}
    });
  });

  module.exports = app;
})();
