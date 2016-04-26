(function () {
  'use strict';

  var User = require('../models').User;
  var Role = require('../models').Role;
  var Document = require('../models').Document;
  var resolveError = require('../utils');

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

      if (req.body.full_name) {
        data.name.full_name = req.body.full_name;
      } else {
        data.name.first_name = req.body.first_name;
        data.name.last_name = req.body.last_name;
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
                full_name: user.name.full_name,
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
        .findOne({_id: req.decoded._id}, '-__v')
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
      return User
        .findOne({_id: req.decoded._id})
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
          if (req.body.full_name) {
            user.name.full_name = req.body.full_name;
          } else if (req.body.first_name || req.body.last_name) {
            user.name.first_name = req.body.first_name || user.name.first_name;
            user.name.last_name = req.body.last_name || user.name.last_name;
          }

          user.save(function (err, user) {
            if (err) {
              return resolveError(err, res);
            }
            return res.status(200).send(user);
          });
        });
    },

    /**
     * Delete a user's account.
     */
    delete: function (req, res) {
      return User.findOneAndRemove({_id: req.decoded._id}, function (err) {
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
            return res.status(400).send({
              message: 'Authentication failed. User not found.'
            });
          } else if (!user.validatePassword(req.body.password)) {
            return res.status(400).send({
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
      User.findOne({username: req.params.username}, function (err, user) {
        if (err) {
          return resolveError(err, res);
        }
        if (!user) {
          return res.status(404).send({
            message: 'User not found.'
          });
        }
        Document.find({owner: user._id})
          .sort('-createdAt')
          .exec(function (err, docs) {
            if (err) {
              return resolveError(err, res);
            }
            docs = docs.filter(function (doc) {
              return doc.role.accessLevel <= req.decoded.role.accessLevel ||
              doc.owner.username === req.decoded.username;
            });
            return res.status(200).send(docs);
          });
      });
    }
  };

  module.exports = usersController;
})();
