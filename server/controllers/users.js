/* eslint-disable no-param-reassign, no-shadow */
const models = require('../models');
const utils = require('../utils');

const User = models.User;
const Role = models.Role;
const Document = models.Document;

const runQuery = utils.runQuery;
const resolveError = utils.resolveError;
const castToObjectID = utils.castToObjectID;

/**
 * Create a user and authenticate them.
 */
function create(req, res) {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: 'user', // Always default to 'user' role for a new user.
    name: {}
  };

  const createUser = (data) => {
    User.create(data, (err, user) => {
      if (err) {
        return resolveError(err, res);
      }
      return User
        .findOne({ _id: user._id }, '-__v')
        .exec((err, user) => {
          if (err) {
            return resolveError(err, res);
          }

          return res.status(201).send({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.name.fullName,
            name: user.name,
            role: user.role,
            token: user.generateJwt()
          });
        });
    });
  };

  if (req.body.fullName) {
    data.name.fullName = req.body.fullName;
  } else {
    data.name.firstName = req.body.firstName;
    data.name.lastName = req.body.lastName;
  }

  Role
    .findOne({ title: data.role })
    .exec((err, role) => {
      if (err) {
        return resolveError(err, res);
      }
      data.role = role._id;
      return createUser(data);
    });
}

/**
 * List all Users.
 * This is an admin only functionality.
 */
function list(req, res) {
  return User
    .find({}, '-__v')
    .exec((err, users) => {
      if (err) {
        return resolveError(err, res);
      }
      return res.status(200).send(users);
    });
}

/**
 * Get the logged in user's profile.
 */
function retrieve(req, res) {
  return User
    .findOne({
      $or: [
        { username: req.params.usernameOrId },
        { _id: castToObjectID(req.params.usernameOrId) }
      ]
    }, '-__v')
    .exec((err, user) => {
      if (err) {
        return resolveError(err, res);
      }

      if (!user) {
        return res.status(404).send({
          message: 'User Not Found'
        });
      }
      return res.status(200).send(user);
    });
}

/**
 * Update the logged in user's details.
 */
function update(req, res) {
  const saveUser = (user) => {
    user.save((err, user) => {
      if (err) {
        if (err.code === 11000) {
          if (/email/.test(err.errmsg)) {
            return resolveError({
              message: 'A user with this email already exists'
            }, res, 409);
          } else if (/username/.test(err.errmsg)) {
            return resolveError({
              message: 'A user with this username already exists'
            }, res, 409);
          }
        }
        return resolveError(err, res, 409);
      }

      return User
        .findOne({ _id: user._id }, '-__v')
        .exec((err, user) => {
          if (err) {
            return resolveError(err, res);
          }
          return res.status(200).send(user);
        });
    });
  };

  return User
    .findOne({
      $or: [
        { username: req.params.usernameOrId },
        { _id: castToObjectID(req.params.usernameOrId) }
      ]
    })
    .exec((err, user) => {
      if (err) {
        return resolveError(err, res);
      }
      if (!user) {
        // Probably using a saved token while it's associated user has been
        // deleted.
        return res.status(404).send({
          message: 'User not found.'
        });
      }

      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;
      if (req.body.email) user.email = req.body.email;
      if (req.body.fullName) {
        user.name.fullName = req.body.fullName;
      } else {
        if (req.body.firstName) user.name.firstName = req.body.firstName;
        if (req.body.lastName) user.name.lastName = req.body.lastName;
      }

      if (req.body.role && typeof req.body.role === 'string') {
        return Role
          .findOne({ title: req.body.role })
          .exec((err, role) => {
            if (err) {
              return resolveError(err, res);
            }
            user.role = role._id;
            return saveUser(user);
          });
      }
      return saveUser(user);
    });
}

/**
 * Delete a user's account.
 */
function deleteUser(req, res) {
  return User.findOneAndRemove({
    $or: [
      { username: req.params.usernameOrId },
      { _id: castToObjectID(req.params.usernameOrId) }
    ]
  }, (err) => {
    if (err) {
      return resolveError(err, res);
    }
    return res.status(204).send();
  });
}

/**
 * Login a user with username and a password.
 */
function login(req, res) {
  return User
    .findOne({
      username: req.body.username
    })
    .select('_id email username password')
    .exec((err, user) => {
      if (err) {
        return resolveError(err, res);
      }

      if (!user) {
        return res.status(401).send({
          message: 'Authentication failed. User not found.'
        });
      } else if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({
          message: 'Incorrect username/password combination'
        });
      }

      return res.status(200).send({
        message: 'Authentication successful',
        token: user.generateJwt()
      });
    });
}

/**
 * Get the specified user's documents.
 */
function documents(req, res) {
  User.findOne({
    $or: [
      { username: req.params.usernameOrId },
      { _id: castToObjectID(req.params.usernameOrId) }
    ]
  }, (err, user) => {
    if (err) {
      return resolveError(err, res);
    }
    if (!user) {
      return res.status(404).send({
        message: 'User not found.'
      });
    }

    const queryParams = req.query;
    const query = Document.find({ owner: user._id })
      .limit(Number(queryParams.limit) || null)
      .sort('-createdAt'); // Sort the documents in descending order.

    return runQuery(req, query)
    .then((docs) => res.status(200).send(docs))
    .catch((err) => resolveError(err, res, 400));
  });
}

module.exports = {
  create,
  list,
  retrieve,
  update,
  deleteUser,
  login,
  documents
};
