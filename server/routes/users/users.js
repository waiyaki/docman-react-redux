(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    app.get('/users', customMiddleware.authenticate,
      customMiddleware.isAdmin, usersController.list
    );
  };
})();
