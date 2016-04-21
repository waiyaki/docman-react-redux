(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * Login a user.
     */
    app.post('/users/login', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['username', 'password']
      });
    }, usersController.login);

    /**
     * Create a new user
     */
    app.post('/users', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['username', 'email', 'password']
      });
    }, usersController.create);
  };
})();
