(function () {
  'use strict';

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
    }
  };

  module.exports = customMiddleware;
})();
