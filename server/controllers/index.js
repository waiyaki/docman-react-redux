(function () {
  'use strict';

  var usersController = require('./users');
  var documentsController = require('./documents');
  var rolesController = require('./roles');

  module.exports = {
    usersController: usersController,
    documentsController: documentsController,
    rolesController: rolesController
  };
})();
