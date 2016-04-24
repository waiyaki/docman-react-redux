(function () {
  'use strict';

  var Document = require('../models').Document;
  var Role = require('../models').Role;
  var resolveError = require('../utils');

  var documentsController = {
    /**
     * Create a document.
     */
    create: function (req, res) {
      var data = req.body;
      data.role = data.role || 'public';
      Role
        .findOne({ title: data.role })
        .exec(function (err, role) {
          if (err) {
            return resolveError(err, res);
          }
          Document
            .create({
              title: data.title,
              content: data.content,
              owner: req.decoded._id,
              role: role._id
            }, function (err, doc) {
              if (err) {
                return resolveError(err, res);
              }
              Document
                .findOne({ _id: doc._id })
                .exec(function (err, doc) {
                  if (err) {
                    return resolveError(err, res);
                  }
                  return res.status(201).send(doc);
                });
            });
        });
    },

    /**
     * List all documents according to the given criteria.
     */
    list: function (req, res) {
      Document
        .find({})
        .sort('-createdAt')
        .exec(function (err, docs) {
          if (err) {
            return resolveError(err, res);
          }
          docs = docs.filter(function (doc) {
            return doc.role.accessLevel <= req.decoded.role.accessLevel ||
            doc.owner.username === req.decoded.username;
          });
          return res.status(200).send(docs.length ? docs : []);
        });
    }
  };

  module.exports = documentsController;
})();
