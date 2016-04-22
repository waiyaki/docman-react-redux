(function () {
  'use strict';

  var jwt = require('jsonwebtoken');
  var app_config = require('../config/config');
  var User = require('../models').User;

  var customMiddleware = {
    /**
     * Validate POST request data.
     */
    validatePost: function (req, res, next, options) {
      var required_fields = options.required_fields;
      var errors = [];
      for (var i = 0; i < required_fields.length; i++) {
        var field = required_fields[i];
        if (!req.body[field]) {
          errors.push({
            [field]: 'This field is required.'
          });
        }
      }
      if (errors.length) {
        return res.status(400).send(errors);
      }
      next();
    },

    /**
     * Ensure the request has an auth token before allowing API access
     */
    authenticate: function (req, res, next) {
      var token = req.body.token || req.params['token'] || req.headers['x-access-token'];

      if (!token) {
        return res.status(401).send({
          message: 'No access token provided.'
        });
      }

      jwt.verify(token, app_config.SECRET_KEY, function (err, decoded) {
        if (err) {
          return res.status(401).send({
            message: 'Failed to authenticate token.'
          });
        }

        req.decoded = decoded;
        next();
      });
    },

    /**
     * Allow only admins to interact with the upcoming endpoint.
     * Has to be used after the `authenticate` middleware.
     */
    isAdmin: function (req, res, next) {
      User
        .findOne({_id: req.decoded._id})
        .populate('role', 'title')
        .exec(function (err, user) {
          if (err) {
            return next(err);
          }

          if (!user) {
            // Maybe we have an invalid token? User deleted? :thinking_face:
            return res.status(401).send({
              message: 'Token validation error. Please try logging in again.'
            });
          }
          if (user.role && user.role.title === 'admin') {
            return next();
          }
          return res.status(403).send({
            message: 'Admin access level required.'
          });
        });
    }
  };

  module.exports = customMiddleware;
})();
