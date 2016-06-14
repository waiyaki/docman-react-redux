const customMiddleware = require('../../middleware');
const docsController = require('../../controllers').documentsController;

module.exports = (app) => {
  /**
   * List all documents accessible by this user.
   */
  app.get('/api/documents', docsController.list);

  /**
   * Create a new document.
   */
  app.post('/api/documents', (req, res, next) => customMiddleware
    .validatePost(req, res, next, {
      requiredFields: ['title', 'content']
    }
  ), docsController.create);

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
  app.delete('/api/documents/:doc_id', docsController.deleteDocument);
};
