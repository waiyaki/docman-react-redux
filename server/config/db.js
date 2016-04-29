(function () {
  /* eslint-disable no-console */
  'use strict';

  var appConfig = require('./config');
  var mongoose = require('mongoose');

  mongoose.connect(appConfig.DB_URI);

  // Log connection events.
  mongoose.connection.once('connected', function () {
    console.log('Mongoose connected to ', appConfig.DB_URI);
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
