(function () {
  'use strict';

  var jwt = require('jsonwebtoken');
  var app_config = require('../config/config');

  var customMiddleware = {
    /**
     * Validate POST request data.
     */
    validatePost: function (req, res, next, options) {
      var required_fields = options.required_fields;
      for (var i = 0; i < required_fields.length; i++) {
        var field = required_fields[i];
        if (!req.body[field]) {
          return res.status(400).send({
            [field]: 'This field is required.'
          });
        }
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
    }
  };

  module.exports = customMiddleware;
})();
