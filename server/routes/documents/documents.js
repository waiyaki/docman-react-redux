(function () {
  'use strict';

  var docsController = require('../../controllers').documentsController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * List all documents accessible by this user.
     */
    app.get('/api/documents', docsController.list);

    /**
     * Create a new document.
     */
    app.post('/api/documents', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['title', 'content']
      });
    }, docsController.create);

    /**
     * Fetch a single document.
     */
    app.get('/api/documents/:doc_id', docsController.retrieve);

    /**
     * Update a document.
     */
    app.put('/api/documents/:doc_id', docsController.update);

    /**
     * Delete a single document.
     */
    app.delete('/api/documents/:doc_id', docsController.delete);
  };
})();
