(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * Get all users in the system. Admin access only.
     */
    app.get('/users', customMiddleware.isAdmin, usersController.list);

    /**
     * Get a logged in user's profile.
     */
    app.get('/users/profile', usersController.retrieve);

    /**
     * Update a user's profile.
     */
    app.put('/users/profile', usersController.update);

    /**
     * Delete a user account.
     */
    app.delete('/users/profile', usersController.delete);

    /**
     * Get a user's documents.
     */
    app.get('/users/:username/documents', usersController.documents);
  };
})();
