/* eslint-disable no-param-reassign, no-shadow */

const Role = require('../models').Role;
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Give users helpful error messages.
 *
 * @param {Object} err - Error thrown
 * @param {Object} res - The response object to return
 * @param {Number} [status] - Status to return to the API user.
 */
function resolveError(err, res, status) {
  if (status) {
    if (['testing', 'production'].indexOf(process.env.NODE_ENV !== -1)) {
      return res.status(status).send({
        message: err.message,
        error: err
      });
    }
    return res.status(status).send({
      message: 'Server encountered an error.'
    });
  }
  if (err.name === 'MongoError') {
    const errmsg = err.errmsg;

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
  }
  // Check for validation errors from Mongoose.
  const validationErrors = ['ValidationError'];
  if (validationErrors.indexOf(err.name) !== -1) {
    const messages = {};
    Object.keys(err.errors).forEach((key) => {
      messages.message = err.errors[key].message;
    });
    return res.status(400).send(messages);
  }
  if (['testing', 'production'].indexOf(process.env.NODE_ENV !== -1)) {
    return res.status(500).send({
      message: 'Server encountered an error.',
      error: err
    });
  }
  return res.status(500).send({
    message: 'Server encountered an error.'
  });
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
function filterByDate(queryParams) {
  return new Promise((resolve, reject) => {
    const hasDate = queryParams.created || queryParams.created_min || queryParams.created_min;
    if (!hasDate) {
      return resolve({});
    }
    const parseDate = (date) => {
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
        const date = parseDate(queryParams.created);
        let createdMax = new Date(date);
        // Add a day to this day to get everything that was created between
        // this date and the next at 0000hrs.
        createdMax = createdMax.setDate(createdMax.getDate() + 1);
        queryParams.created_min = date;
        queryParams.created_max = createdMax;
      } else {
        if (queryParams.created_max) {
          let maxDate = parseDate(queryParams.created_max);
          maxDate = new Date(maxDate);
          // Include today's records as well.
          maxDate = maxDate.setDate(maxDate.getDate() + 1);
          queryParams.created_max = maxDate;
        } else if (queryParams.created_min) {
          queryParams.created_min = parseDate(queryParams.created_min);
        }
      }
      const param = Object.assign({}, {
        created_min: queryParams.created_min,
        created_max: queryParams.created_max
      });
      return resolve(param);
    } catch (err) {
      const error = new Error(`Error parsing date: ${err.message}`);
      return reject(error);
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
function filterByRole(queryParams) {
  return new Promise((resolve, reject) => {
    if (!queryParams.role) {
      return resolve({});
    }
    return Role.findOne({ title: queryParams.role }, (err, role) => {
      if (err) {
        return reject(err);
      }
      if (!role) {
        const error = new Error(`${queryParams.rol}: This role is invalid.`);
        return reject(error);
      }
      return resolve({ role });
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
function runQuery(req, query) {
  const queryParams = req.query;
  return new Promise((resolve, reject) => {
    Promise.all([
      filterByDate(queryParams),
      filterByRole(queryParams)
    ]).then((queryParams) => {
      const params = queryParams
        .reduce((params, q) => Object.assign(params, q), {});

      if (params.created_max || params.created_min) {
        query.where('createdAt')
          .gte(params.created_min)
          .lte(params.created_max);
      }
      if (params.role) {
        query.where('role').equals(params.role._id);
      }

      query.exec((err, docs) => {
        if (err) {
          return reject(err);
        }
        docs = docs.filter((doc) => {
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
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Emit a socket event.
 *
 * Do not emit socket events when private documents have changed, unless
 * forced.
 */
function emitSocketEvent(SocketIO, doc, eventType, force) {
  if (force) {
    SocketIO.in('public').emit(eventType, doc);
  } else if (doc.role && doc.role.title !== 'private') {
    SocketIO.in(doc.role.title).emit(eventType, doc);

    // Send even admin docs to their owners.
    if (doc.role.title === 'admin') {
      SocketIO.in(doc.owner.username).emit(eventType, doc);
    }
  }

  // Since private documents are not publicly broadcasted, this
  // selectively broadcasts private documents to admins.
  if (doc.role && doc.role.title === 'private') {
    // BUG: Will potentially broadcast to the owner twice
    // if the owner is an admin 😕
    SocketIO.in('admin').emit(eventType, doc);
  }
}

/**
 * Cast some string value to MongoDB ObjectId
 *
 * The `01234567890123` ensures MongoDB won't error out as it tries to cast
 * `value` into an ObjectId while the value is less than 12 characters.
 */
function castToObjectID(value) {
  return new ObjectId(value.length >= 12 ? value : '012345678901');
}

module.exports = {
  castToObjectID,
  emitSocketEvent,
  resolveError,
  runQuery
};
