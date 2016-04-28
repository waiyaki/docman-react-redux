(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * Get all users in the system. Admin access only.
     */
    app.get('/users',
      customMiddleware.isAdminOrOwnProfile, usersController.list);

    /**
     * Get a logged in user's profile.
     */
    app.get('/users/:username',
      customMiddleware.isAdminOrOwnProfile, usersController.retrieve);

    /**
     * Update a user's profile.
     */
    app.put('/users/:username',
      customMiddleware.isAdminOrOwnProfile, usersController.update);

    /**
     * Delete a user account.
     */
    app.delete('/users/:username',
      customMiddleware.isAdminOrOwnProfile, usersController.delete);

    /**
     * Get a user's documents.
     */
    app.get('/users/:username/documents', usersController.documents);
  };
})();
