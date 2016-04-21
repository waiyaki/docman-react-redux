(function () {
  'use strict';

  var express = require('express');
  var logger = require('morgan');
  var bodyParser = require('body-parser');
  var dotenv = require('dotenv');

  var env = process.env.NODE_ENV;
  if (env === 'testing' || env === 'development') {
    dotenv.load();
  }
  var app = express();

  // Connect to the db.
  require('./server/config/db');

  // Log all requests to the console when not testing.
  if (process.env.NODE_ENV !== 'testing') {
    app.use(logger('dev'));
  }

  // Grab post data from the request.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Routes
  require('./server/routes')(app);

  module.exports = app;
})();
