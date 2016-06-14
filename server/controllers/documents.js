/* eslint-disable no-param-reassign, no-shadow */
const Document = require('../models').Document;
const Role = require('../models').Role;
const utils = require('../utils');

const runQuery = utils.runQuery;
const resolveError = utils.resolveError;
const emitSocketEvent = utils.emitSocketEvent;

/**
 * Create a document.
 */
function create(req, res) {
  const data = req.body;
  data.role = data.role || 'public';
  Role
    .findOne({ title: data.role })
    .exec((err, role) => {
      if (err) {
        return resolveError(err, res);
      }
      return Document
        .create({
          title: data.title,
          content: data.content,
          owner: req.decoded._id,
          role: role._id
        }, (err, doc) => {
          if (err) {
            return resolveError(err, res);
          }
          return Document
            .findOne({ _id: doc._id })
            .exec((e, documentObj) => {
              if (e) {
                return resolveError(e, res);
              }
              if (global.io) {
                emitSocketEvent(global.io, documentObj, 'document:create');
              }
              return res.status(201).send(documentObj);
            });
        });
    });
}

/**
 * List all documents according to the given criteria.
 */
function list(req, res) {
  const queryParams = req.query;
  const query = Document.find({})
    .limit(Number(queryParams.limit) || null)
    .sort('-createdAt'); // Sort the documents in descending order.

  return runQuery(req, query)
    .then((docs) => res.status(200).send(docs))
    .catch((err) => resolveError(err, res, 400));
}

/**
 * Fetch a single document.
 */
function retrieve(req, res) {
  Document.findOne({ _id: req.params.doc_id }).exec((err, doc) => {
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
}

/**
 * Update a document.
 */
function update(req, res) {
  Document.findOne({ _id: req.params.doc_id })
    .exec((err, doc) => {
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
        return Role.findOne({ title: req.body.role }, (err, role) => {
          if (err) {
            return resolveError(err, res);
          }

          // Determine whether we're changing documents role.
          const roleHasChanged = doc.role.title !== role.title;

          doc.role = role._id;
          return doc.save((e) => {
            if (e) {
              return resolveError(e, res);
            }
            // Have to findOne here else role will not be populated.
            return Document
              .findOne({ _id: doc._id })
              .exec((err, doc) => { // eslint-disable-line
                if (err) {
                  return resolveError(err, res);
                }
                if (global.io) {
                  if (roleHasChanged) {
                    emitSocketEvent(
                      global.io, doc, 'document:role-update', true);
                  } else {
                    emitSocketEvent(global.io, doc, 'document:update');
                  }
                }
                return res.status(200).send(doc);
              });
          });
        });
      }

      return doc.save((err) => {
        if (err) {
          return resolveError(err, res);
        }
        emitSocketEvent(global.io, doc, 'document:update');
        return res.status(200).send(doc);
      });
    });
}

/**
 * Delete a single document.
 */
function deleteDocument(req, res) {
  Document.findOne({ _id: req.params.doc_id })
    .remove()
    .exec((err, docsRemoved) => {
      if (err) {
        return resolveError(err, res);
      }
      if (!docsRemoved) {
        return res.status(404).send({
          message: 'Document not found.'
        });
      }
      if (global.io) {
        emitSocketEvent(
          global.io, req.params.doc_id, 'document:delete', true);
      }
      return res.status(204).send({});
    });
}

module.exports = {
  create,
  list,
  retrieve,
  update,
  deleteDocument
};
