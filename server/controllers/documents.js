(function () {
  'use strict';

  var Document = require('../models').Document;
  var resolveError = require('../utils');

  var documentsController = {
    list: function (req, res) {
      Document
        .find({})
        .exec(function (err, docs) {
          if (err) {
            return resolveError(err, res);
          }
          docs = docs.filter(function (doc) {
            return doc.role.accessLevel <= req.decoded.role.accessLevel;
          });
          return res.status(200).send(docs.length ? docs : []);
        });
    }
  };

  module.exports = documentsController;
})();
