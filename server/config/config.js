(function () {
  'use strict';

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  var DB_URI = '';
  if (process.env.NODE_ENV === 'development') {
    DB_URI = 'mongodb://localhost/docman-dev';
  } else if (process.env.NODE_ENV === 'testing') {
    DB_URI = 'mongodb://localhost/docman-testing';
  }

  module.exports = {
    DB_URI: process.env.DB_URI || DB_URI,
    SECRET_KEY: process.env.SECRET_KEY
  };
})();
