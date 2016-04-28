(function () {
  'use strict';

  var Document = require('../models').Document;
  var Role = require('../models').Role;
  var utils = require('../utils');
  var filterByDate = utils.filterByDate;
  var filterByUser = utils.filterByUser;
  var filterByRole = utils.filterByRole;
  var resolveError = utils.resolveError;

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
      function runQuery (query) {
        Promise.all([
          filterByDate(queryParams),
          filterByRole(queryParams),
          filterByUser(queryParams)
        ]).then(function (queryParams) {
          var params = queryParams.reduce(function (params, q) {
            return Object.assign(params, q);
          }, {});

          if (params.created_max || params.created_min) {
            query.where('createdAt')
              .gte(params.created_min)
              .lte(params.created_max);
          }
          if (params.role) {
            query.where('role').equals(params.role._id);
          }
          if (params.user) {
            query.where('owner').equals(params.user._id);
          }

          query.exec(function (err, docs) {
            if (err) {
              return resolveError(err, res);
            }
            docs = docs.filter(function (doc) {
              if (req.decoded._id) {
                // We can access anything we own.
                if (doc.owner.username === req.decoded.username) {
                  return true;
                } else if (req.decoded.role.title === 'admin') {
                  // Admins can access anything.
                  return true;
                }
                // If we're authenticated, we can access docs reserved for
                // authenticated users.
                return doc.role.title === 'user' || doc.role.title === 'public';
              }
              // Anyone else can only access the public docs.
              return doc.role.title === 'public';
            });

            return res.status(200).send(docs.length ? docs : []);
          });
        }).catch(function (err) {
          return resolveError(err, res, 400);
        });
      }

      var queryParams = req.query;
      var query = Document.find({})
        .limit(Number(queryParams.limit) || null)
        .sort('-createdAt'); // Sort the documents in descending order.

      return runQuery(query);
    },

    /**
     * Fetch a single document.
     */
    retrieve: function (req, res) {
      Document.findOne({_id: req.params.doc_id}).exec(function (err, doc) {
        if (err) {
          return resolveError(err, res);
        }
        if (!doc) {
          return res.status(404).send({
            message: 'Document not found.'
          });
        }
        return res.status(200).send(doc);
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
    },

    /**
     * Delete a single document.
     */
    delete: function (req, res) {
      Document.findOne({_id: req.params.doc_id})
        .remove()
        .exec(function (err, docsRemoved) {
          if (err) {
            return resolveError(err, res);
          }
          if (!docsRemoved) {
            return res.status(404).send({
              message: 'Document not found.'
            });
          }
          return res.status(204).send({});
        });
    }
  };

  module.exports = documentsController;
})();
