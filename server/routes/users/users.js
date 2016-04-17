(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customGenericMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * Create a new user
     */
    app.post('/users', function (req, res, next) {
      return customGenericMiddleware.validatePost(req, res, next, {
        required_fields: ['username', 'email', 'password']
      });
    }, usersController.create);
  };
})();
