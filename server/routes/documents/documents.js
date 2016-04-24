(function () {
  'use strict';

  var docsController = require('../../controllers').documentsController;

  module.exports = function (app) {
    /**
     * List all documents accessible by this user.
     */
    app.get('/documents', docsController.list);
  };
})();
