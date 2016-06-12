(function () {
  'use strict';

  var User = require('../models').User;
  var Role = require('../models').Role;
  var Document = require('../models').Document;
  var resolveError = require('../utils').resolveError;
  var runQuery = require('../utils').runQuery;
  var castToObjectID = require('../utils').castToObjectID;

  var usersController = {
    /**
     * Create a user and authenticate them.
     */
    create: function (req, res) {
      var data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'user', // Always default to 'user' role for a new user.
        name: {}
      };

      if (req.body.fullName) {
        data.name.fullName = req.body.fullName;
      } else {
        data.name.firstName = req.body.firstName;
        data.name.lastName = req.body.lastName;
      }

      Role
        .findOne({ title: data.role })
        .exec(function (err, role) {
          if (err) {
            return resolveError(err, res);
          }
          data.role = role._id;
          return createUser(data);
        });

      function createUser (data) {
        User.create(data, function (err, user) {
          if (err) {
            return resolveError(err, res);
          }
          User
            .findOne({ _id: user._id }, '-__v')
            .exec(function (err, user) {
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
      }
    },

    /**
     * List all Users.
     * This is an admin only functionality.
     */
    list: function (req, res) {
      return User
        .find({}, '-__v')
        .exec(function (err, users) {
          if (err) {
            return resolveError(err, res);
          }
          return res.status(200).send(users);
        });
    },

    /**
     * Get the logged in user's profile.
     */
    retrieve: function (req, res) {
      return User
        .findOne({
          $or: [
            {username: req.params.usernameOrId},
            {_id: castToObjectID(req.params.usernameOrId)}
          ]
        }, '-__v')
        .exec(function (err, user) {
          if (err) {
            return resolveError(err, res);
          }
          return res.status(200).send(user);
        });
    },

    /**
     * Update the logged in user's details.
     */
    update: function (req, res) {
      function saveUser (user) {
        user.save(function (err, user) {
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
            .exec(function (err, user) {
              if (err) {
                return resolveError(err, res);
              }
              return res.status(200).send(user);
            });
        });
      }

      return User
        .findOne({
          $or: [
            {username: req.params.usernameOrId},
            {_id: castToObjectID(req.params.usernameOrId)}
          ]
        })
        .exec(function (err, user) {
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
            Role
              .findOne({ title: req.body.role })
              .exec(function (err, role) {
                if (err) {
                  return resolveError(err, res);
                }
                user.role = role._id;
                saveUser(user);
              });
          } else {
            saveUser(user);
          }
        });
    },

    /**
     * Delete a user's account.
     */
    delete: function (req, res) {
      return User.findOneAndRemove({
        $or: [
          {username: req.params.usernameOrId},
          {_id: castToObjectID(req.params.usernameOrId)}
        ]
      }, function (err) {
        if (err) {
          return resolveError(err, res);
        }
        return res.status(204).send();
      });
    },

    /**
     * Login a user with username and a password.
     */
    login: function (req, res) {
      return User
        .findOne({
          username: req.body.username
        })
        .select('_id email username password')
        .exec(function (err, user) {
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
    },

    /**
     * Get the specified user's documents.
     */
    documents: function (req, res) {
      User.findOne({
        $or: [
          {username: req.params.usernameOrId},
          {_id: castToObjectID(req.params.usernameOrId)}
        ]
      }, function (err, user) {
        if (err) {
          return resolveError(err, res);
        }
        if (!user) {
          return res.status(404).send({
            message: 'User not found.'
          });
        }

        var queryParams = req.query;
        var query = Document.find({owner: user._id})
          .limit(Number(queryParams.limit) || null)
          .sort('-createdAt'); // Sort the documents in descending order.

        return runQuery(req, query).then(function (docs) {
          return res.status(200).send(docs);
        }).catch(function (err) {
          return resolveError(err, res, 400);
        });
      });
    }
  };

  module.exports = usersController;
})();
