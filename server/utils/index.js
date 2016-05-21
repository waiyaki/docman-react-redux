(function () {
  'use strict';

  var Role = require('../models').Role;

  /**
   * Give users helpful error messages.
   *
   * @param {Object} err - Error thrown
   * @param {Object} res - The response object to return
   * @param {Number} [status] - Status to return to the API user.
   */
  function resolveError (err, res, status) {
    if (status) {
      if (['testing', 'production'].indexOf(process.env.NODE_ENV !== -1)) {
        return res.status(status).send({
          message: err.message,
          error: err
        });
      } else {
        return res.status(status).send({
          message: 'Server encountered an error.'
        });
      }
    }
    if (err.name === 'MongoError') {
      var errmsg = err.errmsg;

      // Handle unique constraint violation.
      if (err.code === 11000) {
        if (/email/.test(errmsg)) {
          return res.status(400).send({
            message: 'A user with this email already exists'
          });
        } else if (/username/.test(errmsg)) {
          return res.status(400).send({
            message: 'A user with this username already exists'
          });
        }
      }
      return res.status(400).send({
        message: errmsg
      });
    } else {
      // Check for validation errors from Mongoose.
      var validationErrors = ['ValidationError'];
      if (validationErrors.indexOf(err.name) !== -1) {
        var messages = {};
        Object.keys(err.errors).forEach(function (key) {
          messages.message = err.errors[key].message;
        });
        return res.status(400).send(messages);
      }
      if (['testing', 'production'].indexOf(process.env.NODE_ENV !== -1)) {
        return res.status(500).send({
          message: 'Server encountered an error.',
          error: err
        });
      } else {
        return res.status(500).send({
          message: 'Server encountered an error.'
        });
      }
    }
  }

  /**
   * Filter documents by the given date query.
   *
   * @param {Object} [queryParams]
   * @param {Object} [queryParams.created] - Filter documents created on
   *                                       this date.
   * @param {Object} [queryParams.created_min] - Filter documents created
   *                                           later than this date.
   * @param {Object} [queryParams.created_max] - Filter documents created
   *                                           earlier than this date.
   *
   * @returns {Object} - With created_max and created_min date range.
   */
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
            _max = _max.setDate(_max.getDate() + 1);
            queryParams.created_max = _max;
          } else if (queryParams.created_min) {
            queryParams.created_min = parseDate(queryParams.created_min);
          }
        }
        var param = Object.assign({}, {
          created_min: queryParams.created_min,
          created_max: queryParams.created_max
        });
        resolve(param);
      } catch (err) {
        var error = new Error('Error parsing date: ' + err.message);
        reject(error);
      }
    });
  }

  /**
   * Filter documents by the given role query.
   *
   * @param {Object} [queryParams]
   * @param {Object} [queryParams.role] - Role title of
   *                 role to find.
   *
   * @returns {Object} Role object
   */
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
          var error = new Error(
            queryParams.role + ': This role is invalid.');
          return reject(error);
        }
        resolve({role: role});
      });
    });
  }

  /**
   * Return documents obtained by running a query from the user against the
   * documents model.
   *
   * @param {Object} req - The request object.
   * @param {Object} query - A Mongoose query object.
   *
   * @returns {Array} - An array of documents.
   */
  function runQuery (req, query) {
    var queryParams = req.query;
    return new Promise(function (resolve, reject) {
      Promise.all([
        filterByDate(queryParams),
        filterByRole(queryParams)
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

        query.exec(function (err, docs) {
          if (err) {
            return reject(err);
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

          return resolve(docs);
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  module.exports = {
    resolveError: resolveError,
    runQuery: runQuery
  };
})();
