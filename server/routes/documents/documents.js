(function () {
  'use strict';

  var docsController = require('../../controllers').documentsController;
  var customMiddleware = require('../../middleware');

  module.exports = function (app) {
    /**
     * List all documents accessible by this user.
     */
    app.get('/documents', docsController.list);

    /**
     * Create a new document.
     */
    app.post('/documents', function (req, res, next) {
      return customMiddleware.validatePost(req, res, next, {
        required_fields: ['title', 'content']
      });
    }, docsController.create);

    /**
     * Fetch a single document.
     */
    app.get('/documents/:doc_id', docsController.retrieve);

    /**
     * Update a document.
     */
    app.put('/documents/:doc_id', docsController.update);

    /**
     * Delete a single document.
     */
    app.delete('/documents/:doc_id', docsController.delete);
  };
})();
