/* eslint-disable no-console */

const appConfig = require('./config');
const mongoose = require('mongoose');

mongoose.connect(appConfig.DB_URI);

// Log connection events.
mongoose.connection.once('connected', () => {
  console.log('Mongoose connected to ', appConfig.DB_URI);
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
