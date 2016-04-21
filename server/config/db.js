(function () {
  /* eslint-disable no-console */
  'use strict';

  var app_config = require('./config');
  var mongoose = require('mongoose');

  mongoose.connect(app_config.DB_URI);

  // Log connection events.
  mongoose.connection.once('connected', function () {
    console.log('Mongoose connected to ', app_config.DB_URI);
  });

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
  });

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });

  // Register the models.
  require('../models');
})();
