(function () {
  'use strict';

  var usersController = require('./users');
  var documentsController = require('./documents');

  module.exports = {
    usersController: usersController,
    documentsController: documentsController
  };
})();
