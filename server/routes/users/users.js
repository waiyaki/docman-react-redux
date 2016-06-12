(function () {
  'use strict';

  var usersController = require('../../controllers').usersController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * Get all users in the system. Admin access only.
     */
    app.get('/api/users',
      customMiddleware.isAdminOrOwnProfile, usersController.list);

    /**
     * Get a logged in user's profile.
     */
    app.get('/api/users/:usernameOrId', usersController.retrieve);

    /**
     * Update a user's profile.
     */
    app.put('/api/users/:usernameOrId',
      customMiddleware.isAdminOrOwnProfile, usersController.update);

    /**
     * Delete a user account.
     */
    app.delete('/api/users/:usernameOrId',
      customMiddleware.isAdminOrOwnProfile, usersController.delete);

    /**
     * Get a user's documents.
     */
    app.get('/api/users/:usernameOrId/documents', usersController.documents);
  };
})();
