(function () {
  'use strict';

  var User = require('../models/users');
  var Role = require('../models/roles');

  var usersController = {
    /**
     * Create a user and authenticate them.
     *
     * @returns {Object} User object with an authentication token.
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
          if (!role) {
            Role.create({
              title: data.role
            }, function (err, role) {
              if (err) {
                return resolveError(err, res);
              }
              data.role = role._id;
              return createUser(data);
            });
          } else {
            data.role = role._id;
            return createUser(data);
          }
        });

      function createUser (data) {
        User.create(data, function (err, user) {
          if (err) {
            return resolveError(err, res);
          }
          User
            .findOne({ _id: user._id }, '-__v')
            .populate('role', '_id title')
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
    }
  };

  /**
   * Give users helpful error messages.
   */
  function resolveError (err, res) {
    if (err.name === 'MongoError') {
      // Handle Mongo Errors.
      err = err.toJSON();
      var errmsg = err.errmsg;
      var data = {
        username: err.op.username,
        email: err.op.email
      };

      // Handle unique constraint violation.
      if (err.code === 11000) {
        if (/email/.test(errmsg)) {
          return res.status(400).send({
            message: 'A user with this email already exists',
            data: data
          });
        } else if (/username/.test(errmsg)) {
          return res.status(400).send({
            message: 'A user with this username already exists',
            data: data
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
        return res.status(400).send({
          error: err.name,
          message: err.message
        });
      }
      return res.status(500).send(err);
    }
  }

  module.exports = usersController;
})();
