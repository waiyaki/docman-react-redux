(function () {
  'use strict';

  var usersController = require('../controllers').usersController;
  var customMiddleware = require('../middleware');

  module.exports = function (app) {
    // Return a default response for the root url.
    app.get('/', function (req, res) {
      res.json({message: 'Welcome to DocMan'});
    });

    // Create a user
    app.post('/users', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['username', 'email', 'password']
      });
    }, usersController.create);

    // Login a user
    app.post('/users/login', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['username', 'password']
      });
    }, usersController.login);

    /**
     * Beyond this point, only authenticated users should access the API.
     * Unauthenticated users can only either login or register.
     */
    app.use(customMiddleware.authenticate);

    // Users Routes.
    require('./users/users')(app);
  };
})();
