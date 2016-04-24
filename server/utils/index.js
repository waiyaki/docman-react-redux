(function () {
  'use strict';

  /**
   * Give users helpful error messages.
   */
  function resolveError (err, res) {
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
        return res.status(400).send({
          error: err.name,
          message: err.message
        });
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

  module.exports = resolveError;
})();
