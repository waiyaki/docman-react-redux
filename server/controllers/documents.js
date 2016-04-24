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
    },

    /**
     * Update a document.
     */
    update: function (req, res) {
      Document.findOne({_id: req.params.doc_id})
        .exec(function (err, doc) {
          if (err) {
            return resolveError(err, res);
          }
          if (!doc) {
            return res.status(404).send({
              message: 'Document not found.'
            });
          }

          if (req.body.title) doc.title = req.body.title;
          if (req.body.content) doc.content = req.body.content;
          if (req.body.role && typeof req.body.role === 'string') {
            Role.findOne({title: req.body.role}, function (err, role) {
              if (err) {
                return resolveError(err, res);
              }
              doc.role = role._id;
              doc.save(function (err) {
                if (err) {
                  return resolveError(err, res);
                }
                // Have to findOne here else role will not be populated.
                Document
                  .findOne({ _id: doc._id })
                  .exec(function (err, doc) {
                    if (err) {
                      return resolveError(err, res);
                    }
                    return res.status(200).send(doc);
                  });
              });
            });
          } else {
            doc.save(function (err) {
              if (err) {
                return resolveError(err, res);
              }
              return res.status(200).send(doc);
            });
          }
        });
    }
  };

  module.exports = documentsController;
})();
