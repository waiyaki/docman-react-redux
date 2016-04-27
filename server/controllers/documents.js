(function () {
  'use strict';

  var Document = require('../models').Document;
  var Role = require('../models').Role;
  var User = require('../models').User;
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
      function filterByDate (queryParams) {
        return new Promise(function (resolve, reject) {
          var hasDate = queryParams.created || queryParams.created_min || queryParams.created_min;
          if (!hasDate) {
            return resolve({});
          }
          var parseDate = function (date) {
            try {
              date = new Date(date);
              if (date.toString() === 'Invalid Date') {
                throw new Error(date);
              }
              return date.toUTCString();
            } catch (err) {
              throw err;
            }
          };
          try {
            if (queryParams.created) {
              var date = parseDate(queryParams.created);
              var created_max = new Date(date);
              // Add a day to this day to get everything that was created between
              // this date and the next at 0000hrs.
              created_max = created_max.setDate(created_max.getDate() + 1);
              queryParams.created_min = date;
              queryParams.created_max = created_max;
            } else {
              if (queryParams.created_max) {
                var _max = parseDate(queryParams.created_max);
                _max = new Date(_max);
                // Include today's records as well.
                created_max = _max.setDate(_max.getDate() + 1);
                queryParams.created_max = created_max;
              } else if (queryParams.created_min) {
                queryParams.created_min = parseDate(queryParams.created_min);
              }
            }
            var qp = Object.assign({}, {
              created_min: queryParams.created_min,
              created_max: queryParams.created_max
            });
            resolve(qp);
          } catch (err) {
            var error = new Error('Error parsing date: ' + err.message);
            reject(error);
          }
        });
      }

      function filterByUser (queryParams) {
        return new Promise(function (resolve, reject) {
          var username = queryParams.user || queryParams.username;
          if (!username) {
            return resolve({});
          }
          User.findOne({username: username}, function (err, user) {
            if (err) {
              return reject(err);
            }
            if (!user) {
              var error = new Error(username + 'This user does not exist.');
              return reject(error);
            }
            resolve({user: user});
          });
        });
      }

      function filterByRole (queryParams) {
        return new Promise(function (resolve, reject) {
          if (!queryParams.role) {
            return resolve({});
          }
          Role.findOne({title: queryParams.role}, function (err, role) {
            if (err) {
              return reject(err);
            }
            if (!role) {
              var error = new Error(queryParams.role + 'This role is invalid.');
              return reject(error);
            }
            resolve({role: role});
          });
        });
      }

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
              return doc.role.accessLevel <= req.decoded.role.accessLevel ||
              doc.owner.username === req.decoded.username;
            });
            return res.status(200).send(docs.length ? docs : []);
          });
        }).catch(function (err) {
          return resolveError(err, res);
        });
      }

      var queryParams = req.query;
      var query = Document.find({})
        .limit(Number(queryParams.limit) || null)
        .sort('-createdAt');

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
